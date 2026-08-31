<?php

declare(strict_types=1);

namespace Idibia\Headless\Core;

/**
 * Handles WordPress Admin menu registration and template mounting.
 */
class AdminMenu {
    public const MENU_SLUG = 'idibia-cms';
    public const PAGE_HOOK = 'toplevel_page_' . self::MENU_SLUG;

    public function init(): void {
        add_action('admin_menu', [$this, 'registerMenu']);
    }

    public function registerMenu(): void {
        add_menu_page(
            __('Idibia CMS', 'idibia-headless'),
            __('Idibia CMS', 'idibia-headless'),
            'manage_options',
            self::MENU_SLUG,
            [$this, 'renderPage'],
            'dashicons-layout',
            30
        );
    }

    public function renderPage(): void {
        ?>
        <div class="wrap idibia-cms-admin-wrap" style="margin: 0; padding: 0;">
            <!-- React Single Page Application Mount Point -->
            <div id="idibia-cms-root">
                <div style="padding: 2.5rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                        <h2 style="margin: 0 0 0.5rem; color: #0f172a; font-size: 1.25rem;">Initializing Idibia Headless CMS...</h2>
                        <p style="margin: 0 0 1rem; color: #64748b; font-size: 0.875rem; line-height: 1.5;">
                            Mounting the React dashboard. If this message stays visible, ensure you have built the React frontend assets (<code>npm run build</code> inside the <code>admin/</code> directory).
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
}
