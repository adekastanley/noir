<?php

declare(strict_types=1);

namespace Idibia\Headless\API;

use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use Idibia\Headless\Security\ApiKeyManager;

class WooCommerceProxyController extends RestController {
    protected $rest_base = 'wc';

    public function register_routes(): void {
        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<path>.*)', [
            [
                'methods'             => \WP_REST_Server::ALLMETHODS,
                'callback'            => [$this, 'proxy_request'],
                'permission_callback' => '__return_true', // Validated internally inside the proxy method based on specific target
            ],
        ]);
    }

    public function proxy_request(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $path = $request->get_param('path');
        $method = $request->get_method();
        
        // Ensure path exists
        if (empty($path)) {
            return $this->error('No WooCommerce path provided.', 'missing_path', 400);
        }

        // Determine if it's the public Store API (for Cart/Checkout) or the restricted Core API (Products/Orders)
        $is_store_api = str_starts_with($path, 'store/');
        
        if ($is_store_api) {
            // Rewrite to WooCommerce Store API: /wc/store/v1/...
            $target_route = '/wc/store/v1/' . substr($path, 6);
        } else {
            // Rewrite to WooCommerce Core API: /wc/v3/...
            $target_route = '/wc/v3/' . $path;
            
            // Core API requires the Idibia API Key (do NOT pass WC Consumer Keys from frontend)
            $allowed_keys = ['secret'];
            
            // Allow Public Keys for read-only (GET) requests to products and categories
            if ($method === 'GET' && preg_match('/^(products|products\/categories|products\/attributes|products\/reviews)($|\/)/', $path)) {
                $allowed_keys = ['secret', 'public'];
            }

            if (!class_exists('Idibia\Headless\Security\ApiKeyManager') || !ApiKeyManager::validate($request, $allowed_keys)) {
                return new WP_Error('rest_forbidden', 'Invalid or missing Idibia API key for WooCommerce proxy.', ['status' => 401]);
            }
        }

        // Build the internal request to WooCommerce
        $wc_request = new WP_REST_Request($method, $target_route);
        $wc_request->set_query_params($request->get_query_params());
        $wc_request->set_body_params($request->get_body_params());
        $wc_request->set_headers($request->get_headers());

        $original_user_id = get_current_user_id();

        // Elevate privileges for Core API so WooCommerce allows read/write without Consumer Keys
        if (!$is_store_api) {
            $admins = get_users(['role' => 'administrator', 'number' => 1, 'fields' => 'ID']);
            if (!empty($admins)) {
                wp_set_current_user((int) $admins[0]);
            }
        }

        // Dispatch the internal request
        $response = rest_do_request($wc_request);

        // Restore original user (crucial for maintaining security boundary)
        if (!$is_store_api) {
            wp_set_current_user($original_user_id);
        }

        if (is_wp_error($response)) {
            return $response;
        }

        // Forward headers back to the frontend (Important for Cart-Token and Nonce in Store API)
        $proxy_response = new WP_REST_Response($response->get_data(), $response->get_status());
        foreach ($response->get_headers() as $key => $value) {
            $proxy_response->header($key, $value);
        }

        return $proxy_response;
    }
}
