<?php

declare(strict_types=1);

namespace Idibia\Headless\Core;

use Idibia\Headless\Modules\WooCommerceRestModule;
use Idibia\Headless\Modules\JwtAuthModule;
use Idibia\Headless\Modules\PaymentGatewayModule;
use Idibia\Headless\Modules\ModuleInterface;

class ModuleManager {
    public const OPTION_NAME = 'idibia_pro_modules';

    private array $registry = [];

    public function __construct() {
        $this->registry = [
            'woocommerce_rest' => WooCommerceRestModule::class,
            'jwt_auth'         => JwtAuthModule::class,
            'payment_gateway'  => PaymentGatewayModule::class,
        ];
    }

    public function getModules(): array {
        $options = (array) get_option(self::OPTION_NAME, []);
        $modules = [];

        foreach ($this->registry as $slug => $className) {
            /** @var ModuleInterface $module */
            $module = new $className();
            $modules[] = [
                'slug'        => $module->slug(),
                'label'       => $module->label(),
                'description' => $module->description(),
                'active'      => isset($options[$slug]) ? (bool) $options[$slug] : false,
            ];
        }

        return $modules;
    }

    public function isModuleActive(string $slug): bool {
        $options = (array) get_option(self::OPTION_NAME, []);
        return isset($options[$slug]) && $options[$slug] === true;
    }

    public function setModuleState(string $slug, bool $active): void {
        if (!isset($this->registry[$slug])) {
            return;
        }

        $options = (array) get_option(self::OPTION_NAME, []);
        $options[$slug] = $active;
        update_option(self::OPTION_NAME, $options, false);
    }

    public function bootActiveModules(): void {
        foreach ($this->registry as $slug => $className) {
            if ($this->isModuleActive($slug)) {
                /** @var ModuleInterface $module */
                $module = new $className();
                $module->boot();
            }
        }
    }
}
