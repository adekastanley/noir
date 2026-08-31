<?php
declare(strict_types=1);
namespace Idibia\Headless\API;

use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use Idibia\Headless\Security\ApiKeyManager;
use Exception;

class PaymentController extends RestController {

    public function register_routes(): void {
        register_rest_route($this->namespace, '/payments/gateways', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_gateways'],
            'permission_callback' => '__return_true'
        ]);

        register_rest_route($this->namespace, '/payments/initialize', [
            'methods'  => 'POST',
            'callback' => [$this, 'initialize_payment'],
            'permission_callback' => [$this, 'check_api_key']
        ]);

        register_rest_route($this->namespace, '/payments/verify', [
            'methods'  => 'POST',
            'callback' => [$this, 'verify_payment'],
            'permission_callback' => [$this, 'check_api_key']
        ]);
    }

    public function check_api_key(WP_REST_Request $request): bool {
        return ApiKeyManager::validate($request, ['secret', 'public']);
    }

    public function get_gateways(WP_REST_Request $request): WP_REST_Response|WP_Error {
        if (!function_exists('WC')) {
            return $this->error('WooCommerce is not active.', 'woocommerce_inactive', 400);
        }

        $available_gateways = WC()->payment_gateways()->get_available_payment_gateways();
        $gateways = [];

        foreach ($available_gateways as $gateway) {
            $gateway_data = [
                'id' => $gateway->id,
                'title' => $gateway->title,
                'description' => $gateway->description,
                'supports' => $gateway->supports,
                'supports_inline' => in_array($gateway->id, ['paystack', 'stripe'], true)
            ];

            if (!empty($gateway->settings)) {
                if (!empty($gateway->settings['public_key'])) {
                    $gateway_data['public_key'] = $gateway->settings['public_key'];
                } elseif (!empty($gateway->settings['test_public_key'])) {
                    $gateway_data['public_key'] = $gateway->settings['test_public_key'];
                }
            }

            $gateways[] = $gateway_data;
        }

        return $this->success($gateways, 200);
    }

    public function initialize_payment(WP_REST_Request $request): WP_REST_Response|WP_Error {
        if (!function_exists('WC')) {
            return $this->error('WooCommerce is not active.', 'woocommerce_inactive', 400);
        }

        $params = $request->get_json_params();
        if (empty($params['gateway'])) {
            return $this->error('Gateway is required.', 'missing_gateway', 400);
        }
        if (empty($params['line_items']) || !is_array($params['line_items'])) {
            return $this->error('Line items are required.', 'missing_line_items', 400);
        }

        $gateway_id = $params['gateway'];
        $available_gateways = WC()->payment_gateways()->get_available_payment_gateways();

        if (!isset($available_gateways[$gateway_id])) {
            return $this->error('Gateway is not available or invalid.', 'invalid_gateway', 400);
        }

        $gateway_instance = $available_gateways[$gateway_id];

        try {
            $order = wc_create_order();
            
            if (!empty($params['billing']) && is_array($params['billing'])) {
                $order->set_address($params['billing'], 'billing');
            }
            if (!empty($params['shipping']) && is_array($params['shipping'])) {
                $order->set_address($params['shipping'], 'shipping');
            }

            foreach ($params['line_items'] as $item) {
                if (empty($item['product_id'])) continue;
                $product = wc_get_product($item['product_id']);
                if ($product) {
                    $order->add_product($product, $item['quantity'] ?? 1);
                }
            }

            if (!empty($params['coupon_codes']) && is_array($params['coupon_codes'])) {
                foreach ($params['coupon_codes'] as $code) {
                    $order->apply_coupon($code);
                }
            }

            if (!empty($params['currency'])) {
                $order->set_currency($params['currency']);
            }

            $order->calculate_totals();
            $order->set_payment_method($gateway_instance);
            
            $reference = 'idibia_' . $order->get_id() . '_' . time();
            $order->update_meta_data('_idibia_payment_ref', $reference);
            
            if (!empty($params['return_url'])) {
                $order->update_meta_data('_idibia_return_url', $params['return_url']);
            }
            
            $order->save();

            $payment_result = [];
            if (method_exists($gateway_instance, 'process_payment')) {
                $payment_result = $gateway_instance->process_payment($order->get_id());
            }

            $response_data = [
                'order_id' => $order->get_id(),
                'order_key' => $order->get_order_key(),
                'reference' => $reference,
                'gateway' => $gateway_id,
                'total' => $order->get_total(),
                'currency' => $order->get_currency(),
            ];

            if (!empty($payment_result['redirect'])) {
                $response_data['payment_url'] = $payment_result['redirect'];
            }

            // Inline gateway specific data (e.g. public key, access code)
            if (in_array($gateway_id, ['paystack', 'stripe'], true)) {
                $public_key = '';
                if (!empty($gateway_instance->settings['public_key'])) {
                    $public_key = $gateway_instance->settings['public_key'];
                } elseif (!empty($gateway_instance->settings['test_public_key'])) {
                    $public_key = $gateway_instance->settings['test_public_key'];
                }
                $response_data['public_key'] = $public_key;
                
                // If Paystack sets an access code somewhere or we can retrieve it
                // We'll leave it simple per instructions unless requested specifically
            }

            return $this->success($response_data, 200);

        } catch (Exception $e) {
            return $this->error($e->getMessage(), 'payment_initialization_error', 500);
        }
    }

    public function verify_payment(WP_REST_Request $request): WP_REST_Response|WP_Error {
        if (!function_exists('WC')) {
            return $this->error('WooCommerce is not active.', 'woocommerce_inactive', 400);
        }

        $params = $request->get_json_params();
        if (empty($params['order_id']) || empty($params['reference'])) {
            return $this->error('Order ID and reference are required.', 'missing_params', 400);
        }

        $order = wc_get_order($params['order_id']);
        if (!$order) {
            return $this->error('Invalid order.', 'invalid_order', 404);
        }

        $stored_reference = $order->get_meta('_idibia_payment_ref');
        if ($stored_reference !== $params['reference']) {
            return $this->error('Invalid payment reference.', 'invalid_reference', 400);
        }

        if ($order->has_status(['completed', 'processing'])) {
            return $this->success([
                'verified' => true,
                'order_id' => $order->get_id(),
                'order_status' => $order->get_status(),
                'transaction_id' => $order->get_transaction_id(),
                'amount_paid' => $order->get_total(),
                'currency' => $order->get_currency(),
                'gateway' => $order->get_payment_method(),
                'paid_at' => $order->get_date_paid() ? $order->get_date_paid()->date('c') : null,
            ], 200);
        }

        $gateway_id = $order->get_payment_method();
        $available_gateways = WC()->payment_gateways()->get_available_payment_gateways();
        $gateway_instance = $available_gateways[$gateway_id] ?? null;

        if (!$gateway_instance) {
            return $this->error('Payment gateway not found.', 'missing_gateway', 400);
        }

        $verified = false;

        try {
            if ($gateway_id === 'paystack') {
                $secret_key = $gateway_instance->settings['secret_key'] 
                    ?? $gateway_instance->settings['live_secret_key'] 
                    ?? $gateway_instance->settings['test_secret_key'] 
                    ?? '';

                if (empty($secret_key)) {
                    throw new Exception('Paystack secret key not configured.');
                }

                $url = 'https://api.paystack.co/transaction/verify/' . rawurlencode($params['reference']);
                $response = wp_remote_get($url, [
                    'headers' => [
                        'Authorization' => 'Bearer ' . $secret_key,
                    ],
                ]);

                if (is_wp_error($response)) {
                    throw new Exception('Failed to connect to Paystack API.');
                }

                $body = json_decode(wp_remote_retrieve_body($response), true);
                if (isset($body['status']) && $body['status'] === true && $body['data']['status'] === 'success') {
                    $verified = true;
                    $order->set_transaction_id($body['data']['id'] ?? $params['reference']);
                }
            } else {
                // Generic gateway: check if webhook updated it already, or if we can mark it
                // Based on instructions: check order status (webhook may have updated it)
                if ($order->has_status(['completed', 'processing'])) {
                    $verified = true;
                }
            }

            if ($verified) {
                $order->update_status('processing', 'Payment verified via Headless API.');
                $order->save();
            }

            return $this->success([
                'verified' => $verified,
                'order_id' => $order->get_id(),
                'order_status' => $order->get_status(),
                'transaction_id' => $order->get_transaction_id(),
                'amount_paid' => $order->get_total(),
                'currency' => $order->get_currency(),
                'gateway' => $order->get_payment_method(),
                'paid_at' => $order->get_date_paid() ? $order->get_date_paid()->date('c') : null,
            ], 200);

        } catch (Exception $e) {
            return $this->error($e->getMessage(), 'verification_error', 500);
        }
    }
}
