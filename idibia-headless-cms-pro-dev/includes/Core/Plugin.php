<?php

declare(strict_types=1);

namespace Idibia\Headless\Core;

use Idibia\Headless\API\SchemaController;
use Idibia\Headless\API\ContentController;
use Idibia\Headless\API\CrudContentController;
use Idibia\Headless\API\ModuleController;

/**
 * Main plugin orchestrator (Singleton).
 */
class Plugin {
    private static ?Plugin $instance = null;
    public AdminMenu $adminMenu;
    public AssetLoader $assetLoader;
    public SchemaController $schemaController;
    public ContentController $contentController;
    public ModuleManager $moduleManager;
    public CrudContentController $crudContentController;

    private function __construct() {
        $this->adminMenu = new AdminMenu();
        $this->assetLoader = new AssetLoader();
        $this->schemaController = new SchemaController();
        $this->contentController = new ContentController();
        $this->moduleManager = new ModuleManager();
        $this->crudContentController = new CrudContentController();
    }

    public static function instance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function boot(): void {
        $this->adminMenu->init();
        $this->assetLoader->init();
        $this->moduleManager->bootActiveModules();

        add_action('rest_api_init', [$this, 'registerRestRoutes']);
    }

    public function registerRestRoutes(): void {
        $this->schemaController->register_routes();
        $this->contentController->register_routes();
        $this->crudContentController->register_routes();
        (new ModuleController())->register_routes();
        (new \Idibia\Headless\API\ApiKeyController())->register_routes();
    }

    public static function activate(): void {
        // Migration hooks or custom table creations will be triggered here.
    }

    public static function deactivate(): void {
        // Cleanup or flush rewrite rules if needed.
    }
}
