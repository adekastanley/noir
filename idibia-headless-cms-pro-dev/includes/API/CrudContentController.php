<?php

declare(strict_types=1);

namespace Idibia\Headless\API;

use WP_REST_Request;
use WP_REST_Response;
use WP_Error;
use Idibia\Headless\Security\ApiKeyManager;
use Idibia\Headless\API\SchemaController;

class CrudContentController extends RestController {
    protected $rest_base = 'content';

    public function register_routes(): void {
        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<group>[a-zA-Z0-9_-]+)', [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'getGroupContent'],
                'permission_callback' => '__return_true', // Validated internally based on schema access level
            ],
            [
                'methods'             => \WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'createGroupContent'],
                'permission_callback' => [$this, 'checkApiKeyPermission'],
            ],
            [
                'methods'             => \WP_REST_Server::EDITABLE, // PUT/PATCH
                'callback'            => [$this, 'updateGroupContent'],
                'permission_callback' => [$this, 'checkApiKeyPermission'],
            ],
            [
                'methods'             => \WP_REST_Server::DELETABLE,
                'callback'            => [$this, 'deleteGroupContent'],
                'permission_callback' => [$this, 'checkApiKeyPermission'],
            ],
        ]);
    }

    public function checkApiKeyPermission(WP_REST_Request $request): bool|WP_Error {
        if (!class_exists('Idibia\Headless\Security\ApiKeyManager') || !\Idibia\Headless\Security\ApiKeyManager::validate($request)) {
            return new WP_Error('rest_forbidden', 'Invalid or missing API key.', ['status' => 401]);
        }
        return true;
    }

    private function getSchemaForGroup(string $slug): ?array {
        $raw = get_option(SchemaController::OPTION_NAME, null);
        $groups = [];

        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            $groups = $decoded['groups'] ?? [];
        } elseif (is_array($raw)) {
            $groups = $raw['groups'] ?? [];
        }

        foreach ($groups as $group) {
            if (isset($group['slug']) && $group['slug'] === $slug) {
                return $group;
            }
        }

        return null;
    }

    private function getAllContent(): array {
        $contentStr = get_option(ContentController::OPTION_NAME, '{}');
        if (!is_string($contentStr)) {
            return [];
        }
        $data = json_decode($contentStr, true);
        if (!is_array($data)) {
            return [];
        }
        if (isset($data['content']) && is_array($data['content'])) {
            return $data['content'];
        }
        return $data;
    }

    private function saveAllContent(array $content): bool {
        $payload = [
            'version'   => IDIBIA_VERSION,
            'updatedAt' => gmdate('c'),
            'content'   => $content,
        ];
        return update_option(ContentController::OPTION_NAME, wp_json_encode($payload), false);
    }

    public function getGroupContent(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $group = sanitize_text_field($request->get_param('group'));
        $schema = $this->getSchemaForGroup($group);

        if (!$schema) {
            return $this->error('Content group not found.', 'not_found', 404);
        }

        if (isset($schema['access_level']) && $schema['access_level'] === 'protected') {
            $perm = $this->checkApiKeyPermission($request);
            if (is_wp_error($perm)) {
                return $perm;
            }
        }

        $allContent = $this->getAllContent();
        $groupContent = $allContent[$group] ?? null;

        if ($groupContent === null) {
            $isCollection = isset($schema['kind']) && $schema['kind'] === 'collection';
            $groupContent = $isCollection ? [] : new \stdClass();
        }

        return $this->success($groupContent);
    }

    public function createGroupContent(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $group = sanitize_text_field($request->get_param('group'));
        $schema = $this->getSchemaForGroup($group);

        if (!$schema) {
            return $this->error('Content group not found.', 'not_found', 404);
        }

        $body = $request->get_json_params();
        if (!is_array($body)) {
            $body = [];
        }

        $allContent = $this->getAllContent();
        $isCollection = isset($schema['kind']) && $schema['kind'] === 'collection';

        if ($isCollection) {
            if (!isset($allContent[$group]) || !is_array($allContent[$group])) {
                $allContent[$group] = [];
            }
            $items = $body['items'] ?? [];
            if (!is_array($items)) {
                $items = [$body]; // Fallback if a single item is posted without 'items' wrapper
            }
            foreach ($items as $item) {
                if (is_array($item)) {
                    if (empty($item['_id'])) {
                        $item['_id'] = function_exists('wp_generate_uuid4') ? wp_generate_uuid4() : uniqid('', true);
                    }
                    $allContent[$group][] = $item;
                }
            }
        } else {
            if (!isset($allContent[$group]) || !is_array($allContent[$group])) {
                $allContent[$group] = [];
            }
            $allContent[$group] = array_merge($allContent[$group], $body);
        }

        $this->saveAllContent($allContent);

        return $this->success($allContent[$group]);
    }

    public function updateGroupContent(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $group = sanitize_text_field($request->get_param('group'));
        $schema = $this->getSchemaForGroup($group);

        if (!$schema) {
            return $this->error('Content group not found.', 'not_found', 404);
        }

        $body = $request->get_json_params();
        if (!is_array($body)) {
            $body = [];
        }

        $allContent = $this->getAllContent();
        $isCollection = isset($schema['kind']) && $schema['kind'] === 'collection';

        if ($isCollection) {
            $allContent[$group] = $body['items'] ?? (isset($body[0]) ? $body : []);
        } else {
            $allContent[$group] = $body;
        }

        $this->saveAllContent($allContent);

        return $this->success($allContent[$group]);
    }

    public function deleteGroupContent(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $group = sanitize_text_field($request->get_param('group'));
        
        $allContent = $this->getAllContent();
        if (isset($allContent[$group])) {
            unset($allContent[$group]);
            $this->saveAllContent($allContent);
        }

        return $this->success(['deleted' => true]);
    }
}
