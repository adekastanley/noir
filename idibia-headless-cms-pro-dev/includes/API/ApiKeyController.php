<?php

declare(strict_types=1);

namespace Idibia\Headless\API;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;
use Idibia\Headless\Security\ApiKeyManager;

/**
 * Controller for Managing API Keys.
 */
class ApiKeyController extends RestController {
    protected $rest_base = 'keys';

    public function register_routes(): void {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [$this, 'getKeys'],
                    'permission_callback' => [$this, 'checkAdminPermission'],
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [$this, 'createKey'],
                    'permission_callback' => [$this, 'checkAdminPermission'],
                    'args'                => [
                        'name' => [
                            'required'          => true,
                            'type'              => 'string',
                            'sanitize_callback' => 'sanitize_text_field',
                            'validate_callback' => fn($param) => !empty(trim($param)),
                        ],
                    ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base . '/(?P<id>[a-zA-Z0-9_-]+)',
            [
                [
                    'methods'             => WP_REST_Server::DELETABLE,
                    'callback'            => [$this, 'deleteKey'],
                    'permission_callback' => [$this, 'checkAdminPermission'],
                ],
            ]
        );
    }

    public function getKeys(WP_REST_Request $request): WP_REST_Response {
        $keys = ApiKeyManager::getKeys();
        
        // Strip hashed_key from response
        $safeKeys = array_map(function($key) {
            unset($key['hashed_key']);
            return $key;
        }, $keys);

        return $this->success(array_reverse($safeKeys));
    }

    public function createKey(WP_REST_Request $request): WP_REST_Response {
        $name = trim($request->get_param('name'));
        $type = $request->get_param('type');
        if (!in_array($type, ['secret', 'public'], true)) {
            $type = 'secret'; // default
        }
        
        $result = ApiKeyManager::generateKey($name, $type);
        
        $keyData = $result['key_data'];
        unset($keyData['hashed_key']);

        return $this->success([
            'plain_key' => $result['plain_key'],
            'key'       => $keyData
        ], 201);
    }

    public function deleteKey(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $id = $request->get_param('id');
        
        if (ApiKeyManager::revokeKey($id)) {
            return $this->success(['deleted' => true, 'id' => $id]);
        }
        
        return $this->error(__('Key not found.', 'idibia-headless'), 'key_not_found', 404);
    }
}
