<?php

declare(strict_types=1);

namespace Idibia\Headless\Core;

/**
 * Handles asset loading and dynamic data localization (Vite Dev Server vs Production Build) for WordPress Admin.
 */
class AssetLoader {
    private const DEV_SERVER_URL = 'http://localhost:5173';
    public const SCRIPT_HANDLE = 'idibia-cms-admin';

    public function init(): void {
        add_action('admin_enqueue_scripts', [$this, 'enqueueAssets']);
    }

    public function enqueueAssets(string $hook): void {
        // Only load assets on our dedicated Idibia CMS admin page
        if (strpos($hook, AdminMenu::MENU_SLUG) === false) {
            return;
        }

        $isDev = $this->isDevServerRunning();
        $settings = $this->getSettings($isDev);
        $cmsData  = $this->getCmsData();

        if ($isDev) {
            $this->enqueueDevAssets($settings, $cmsData);
        } else {
            $this->enqueueProdAssets($settings, $cmsData);
        }
    }

    private function isDevServerRunning(): bool {
        if (!defined('IDIBIA_DEV_MODE') || !IDIBIA_DEV_MODE) {
            return false;
        }

        // Check if Vite local development server is reachable
        $connection = @fsockopen('127.0.0.1', 5173, $errno, $errstr, 0.05);
        if (is_resource($connection)) {
            fclose($connection);
            return true;
        }

        return false;
    }

    private function enqueueDevAssets(array $settings, array $cmsData): void {
        add_action('admin_head', function () use ($settings, $cmsData) {
            echo '<script>window.idibiaSettings = ' . wp_json_encode($settings) . ';' . "\n";
            echo 'window.idibiaCmsData = ' . wp_json_encode($cmsData) . ';</script>' . "\n";
            echo '<script type="module" src="' . esc_url(self::DEV_SERVER_URL . '/@vite/client') . '"></script>' . "\n";
            echo '<script type="module" src="' . esc_url(self::DEV_SERVER_URL . '/src/main.tsx') . '"></script>' . "\n";
        });
    }

    private function enqueueProdAssets(array $settings, array $cmsData): void {
        $manifestPath = IDIBIA_PATH . 'build/.vite/manifest.json';
        if (!file_exists($manifestPath)) {
            $manifestPath = IDIBIA_PATH . 'build/manifest.json';
        }

        if (file_exists($manifestPath)) {
            $manifest = json_decode((string) file_get_contents($manifestPath), true);
            $entry = $manifest['src/main.tsx'] ?? $manifest['index.html'] ?? null;

            if ($entry) {
                // Enqueue Main JS Bundle
                if (!empty($entry['file'])) {
                    wp_enqueue_script(
                        self::SCRIPT_HANDLE,
                        IDIBIA_URL . 'build/' . $entry['file'],
                        ['wp-element', 'wp-api-fetch'],
                        IDIBIA_VERSION,
                        true
                    );

                    // Inject settings and cmsData payloads before the script executes
                    wp_add_inline_script(
                        self::SCRIPT_HANDLE,
                        'window.idibiaSettings = ' . wp_json_encode($settings) . ';' . "\n" .
                        'window.idibiaCmsData = ' . wp_json_encode($cmsData) . ';',
                        'before'
                    );

                    wp_localize_script(self::SCRIPT_HANDLE, 'idibiaSettings', $settings);
                    wp_localize_script(self::SCRIPT_HANDLE, 'idibiaCmsData', $cmsData);
                }

                // Enqueue CSS files
                if (!empty($entry['css'])) {
                    foreach ($entry['css'] as $i => $cssFile) {
                        wp_enqueue_style(
                            self::SCRIPT_HANDLE . '-' . $i,
                            IDIBIA_URL . 'build/' . $cssFile,
                            [],
                            IDIBIA_VERSION
                        );
                    }
                }
                return;
            }
        }

        // Direct Fallback if manifest is not present
        $jsFile = IDIBIA_PATH . 'build/assets/main.js';
        $cssFile = IDIBIA_PATH . 'build/assets/main.css';

        if (file_exists($jsFile)) {
            wp_enqueue_script(
                self::SCRIPT_HANDLE,
                IDIBIA_URL . 'build/assets/main.js',
                ['wp-element', 'wp-api-fetch'],
                IDIBIA_VERSION,
                true
            );

            wp_add_inline_script(
                self::SCRIPT_HANDLE,
                'window.idibiaSettings = ' . wp_json_encode($settings) . ';' . "\n" .
                'window.idibiaCmsData = ' . wp_json_encode($cmsData) . ';',
                'before'
            );

            wp_localize_script(self::SCRIPT_HANDLE, 'idibiaSettings', $settings);
            wp_localize_script(self::SCRIPT_HANDLE, 'idibiaCmsData', $cmsData);
        }

        if (file_exists($cssFile)) {
            wp_enqueue_style(
                self::SCRIPT_HANDLE . '-main',
                IDIBIA_URL . 'build/assets/main.css',
                [],
                IDIBIA_VERSION
            );
        }
    }

    /**
     * Prepares the dynamic idibiaCmsData object for the React dashboard.
     */
    private function getCmsData(): array {
        return [
            'apiBaseUrl'   => esc_url_raw(get_rest_url(null, 'idibia/v1/')),
            'wpRestUrl'    => esc_url_raw(get_rest_url()),
            'siteName'     => get_bloginfo('name'),
            'siteUrl'      => get_site_url(),
            'adminUrl'     => admin_url(),
            'pluginUrl'    => IDIBIA_URL,
            'version'      => IDIBIA_VERSION,
            'nonce'        => wp_create_nonce('wp_rest'),
            'agencyUrl'    => 'https://idibia.com',
            'proUrl'       => 'https://idibia.com/products',
        ];
    }

    private function getSettings(bool $isDev): array {
        $currentUser = wp_get_current_user();

        return [
            'apiUrl'       => esc_url_raw(get_rest_url(null, 'idibia/v1/')),
            'wpRestUrl'    => esc_url_raw(get_rest_url()),
            'siteName'     => get_bloginfo('name'),
            'nonce'        => wp_create_nonce('wp_rest'),
            'siteUrl'      => get_site_url(),
            'adminUrl'     => admin_url(),
            'pluginUrl'    => IDIBIA_URL,
            'version'      => IDIBIA_VERSION,
            'phpVersion'   => PHP_VERSION,
            'isDev'        => $isDev,
            'user'         => [
                'id'          => get_current_user_id(),
                'canManage'   => current_user_can('manage_options'),
                'displayName' => $currentUser->display_name ?? 'Admin',
            ],
        ];
    }
}
