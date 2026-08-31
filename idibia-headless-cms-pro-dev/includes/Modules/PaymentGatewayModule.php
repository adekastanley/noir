<?php
declare(strict_types=1);
namespace Idibia\Headless\Modules;

class PaymentGatewayModule implements ModuleInterface {
    public function slug(): string { return 'payment_gateway'; }
    public function label(): string { return 'Payment Gateway'; }
    public function description(): string { return 'Universal headless payment processing. Discover active gateways, initialize payments, and verify transactions through any WooCommerce-compatible payment provider.'; }
    public function boot(): void {
        add_action('rest_api_init', function (): void {
            $controller = new \Idibia\Headless\API\PaymentController();
            $controller->register_routes();
        });
    }
}
