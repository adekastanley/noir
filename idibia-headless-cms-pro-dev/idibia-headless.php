<?php
/**
 * Plugin Name:       Idibia Headless CMS Pro
 * Plugin URI:        https://idibia.com
 * Description:       Proprietary, distraction-free headless CMS and schema builder for WordPress.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Idibia
 * Author URI:        https://idibia.com
 * License:           Proprietary
 * Text Domain:       idibia-headless
 */

declare(strict_types=1);

namespace Idibia\Headless;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants.
define('IDIBIA_VERSION', '1.0.1');
define('IDIBIA_FILE', __FILE__);
define('IDIBIA_PATH', plugin_dir_path(__FILE__));
define('IDIBIA_URL', plugin_dir_url(__FILE__));
define('IDIBIA_DEV_MODE', defined('WP_DEBUG') && WP_DEBUG);

// Require standalone autoloader.
require_once IDIBIA_PATH . 'includes/Autoloader.php';

// Register autoloader.
Autoloader::register();

/**
 * Helper to retrieve the main plugin singleton instance.
 */
function idibia(): Core\Plugin {
    return Core\Plugin::instance();
}

// Boot plugin on plugins_loaded.
add_action('plugins_loaded', function () {
    idibia()->boot();
});

// Plugin activation & deactivation hooks.
register_activation_hook(__FILE__, [Core\Plugin::class, 'activate']);
register_deactivation_hook(__FILE__, [Core\Plugin::class, 'deactivate']);
