<?php

declare(strict_types=1);

namespace Idibia\Headless\Modules;

class WooCommerceRestModule implements ModuleInterface {
    public function slug(): string {
        return 'woocommerce_rest';
    }

    public function label(): string {
        return 'WooCommerce REST Wrapper';
    }

    public function description(): string {
        return 'Proxies WooCommerce REST API endpoints through the Idibia namespace for unified API access.';
    }

    public function boot(): void {
        add_action('rest_api_init', function (): void {
            $proxy = new \Idibia\Headless\API\WooCommerceProxyController();
            $proxy->register_routes();
        });
    }
}
