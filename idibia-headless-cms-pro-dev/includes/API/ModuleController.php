<?php

declare(strict_types=1);

namespace Idibia\Headless\API;

use WP_REST_Request;
use WP_REST_Response;
use Idibia\Headless\Core\ModuleManager;

class ModuleController extends RestController {
    protected $rest_base = 'modules';

    public function register_routes(): void {
        register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'getModules'],
                'permission_callback' => [$this, 'checkAdminPermission'],
            ],
            [
                'methods'             => \WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'updateModule'],
                'permission_callback' => [$this, 'checkAdminPermission'],
            ],
        ]);
    }

    public function getModules(WP_REST_Request $request): WP_REST_Response {
        $manager = new ModuleManager();
        return $this->success($manager->getModules());
    }

    public function updateModule(WP_REST_Request $request): WP_REST_Response|\WP_Error {
        $slug = sanitize_text_field($request->get_param('slug') ?? '');
        $active = rest_sanitize_boolean($request->get_param('active'));

        if (empty($slug)) {
            return $this->error('Module slug is required.', 'missing_slug', 400);
        }

        $manager = new ModuleManager();
        $manager->setModuleState($slug, $active);

        return $this->success($manager->getModules());
    }
}
