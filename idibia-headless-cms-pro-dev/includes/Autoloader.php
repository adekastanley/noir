<?php

declare(strict_types=1);

namespace Idibia\Headless;

/**
 * PSR-4 compatible autoloader for Idibia Headless CMS.
 */
class Autoloader {
    private const NAMESPACE_PREFIX = 'Idibia\\Headless\\';

    public static function register(): void {
        spl_autoload_register([__CLASS__, 'autoload']);
    }

    public static function autoload(string $class): void {
        if (!str_starts_with($class, self::NAMESPACE_PREFIX)) {
            return;
        }

        $relativeClass = substr($class, strlen(self::NAMESPACE_PREFIX));
        $file = IDIBIA_PATH . 'includes/' . str_replace('\\', '/', $relativeClass) . '.php';

        if (file_exists($file)) {
            require_once $file;
        }
    }
}
