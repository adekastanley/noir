<?php

declare(strict_types=1);

namespace Idibia\Headless\API;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;
use Idibia\Headless\Security\ApiKeyManager;

/**
 * Controller for Saving and Retrieving Client Content.
 */
class ContentController extends RestController {
    public const OPTION_NAME = 'idibia_cms_content';
    protected $rest_base = 'content';

    /**
     * Register REST API routes.
     */
    public function register_routes(): void {
        register_rest_route(
            $this->namespace,
            '/' . $this->rest_base,
            [
                [
                    'methods'             => WP_REST_Server::READABLE,
                    'callback'            => [$this, 'getContent'],
                    'permission_callback' => '__return_true',
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [$this, 'saveContent'],
                    'permission_callback' => [$this, 'checkAdminPermission'],
                    'args'                => [
                        'content' => [
                            'description'       => __('Content data object mapped by group slugs', 'idibia-headless'),
                            'type'              => 'object',
                            'required'          => true,
                            'validate_callback' => [$this, 'validateContentParam'],
                        ],
                    ],
                ],
            ]
        );
    }

    /**
     * Retrieve all saved content from wp_options.
     */
    public function getContent(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $raw = get_option(self::OPTION_NAME, null);
        $content = [];

        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $content = $decoded;
            }
        } elseif (is_array($raw)) {
            $content = $raw;
        }

        // Handle structural variation (data might be inside 'content' key)
        $contentData = $content['content'] ?? $content;
        
        $requestedGroup = $request->get_param('group');
        
        // Fetch schemas to determine access level
        $schemasRaw = get_option(SchemaController::OPTION_NAME, null);
        $groupsSchema = [];
        if (is_string($schemasRaw)) {
            $dec = json_decode($schemasRaw, true);
            $groupsSchema = $dec['groups'] ?? [];
        } elseif (is_array($schemasRaw)) {
            $groupsSchema = $schemasRaw['groups'] ?? [];
        }

        // Map slug -> access_level
        $accessLevels = [];
        foreach ($groupsSchema as $g) {
            $slug = $g['slug'] ?? '';
            if ($slug) {
                $accessLevels[$slug] = $g['access_level'] ?? 'public';
            }
        }

        $isAuthenticated = ApiKeyManager::validate($request, ['secret', 'public']);

        if ($requestedGroup) {
            $level = $accessLevels[$requestedGroup] ?? 'protected'; // default to protected if unknown
            if ($level === 'protected' && !$isAuthenticated) {
                return $this->error(__('Valid API Key required.', 'idibia-headless'), 'rest_forbidden', 401);
            }
            
            $filteredData = isset($contentData[$requestedGroup]) ? [$requestedGroup => $contentData[$requestedGroup]] : [];
            return $this->success([
                'version' => IDIBIA_VERSION,
                'content' => $filteredData,
                'updatedAt' => $content['updatedAt'] ?? null,
            ]);
        }

        // If no specific group requested, filter out protected ones if unauthenticated
        $filteredContent = [];
        foreach ($contentData as $slug => $data) {
            $level = $accessLevels[$slug] ?? 'protected';
            if ($level === 'public' || $isAuthenticated) {
                $filteredContent[$slug] = $data;
            }
        }

        return $this->success([
            'version' => IDIBIA_VERSION,
            'content' => (object) $filteredContent,
            'updatedAt' => $content['updatedAt'] ?? null,
        ]);
    }

    /**
     * Validate and persist content into wp_options.
     */
    public function saveContent(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $params = $request->get_json_params();

        if (empty($params) || !isset($params['content']) || !is_array($params['content'])) {
            return $this->error(__('Invalid content payload format.', 'idibia-headless'), 'invalid_payload', 400);
        }

        $sanitizedContent = $this->sanitizeContentData($params['content']);

        $payload = [
            'version'   => IDIBIA_VERSION,
            'content'   => $sanitizedContent,
            'updatedAt' => gmdate('c'),
        ];

        $jsonEncoded = wp_json_encode($payload);

        if ($jsonEncoded === false) {
            return $this->error(__('Failed to encode content JSON.', 'idibia-headless'), 'json_encode_error', 500);
        }

        // Store as single JSON string in wp_options (autoload disabled)
        update_option(self::OPTION_NAME, $jsonEncoded, false);

        return $this->success($payload);
    }

    /**
     * Validate the content parameter.
     */
    public function validateContentParam($param, $request, $key): bool {
        return is_array($param);
    }

    /**
     * Recursively sanitize content data before saving.
     */
    private function sanitizeContentData(array $content): array {
        $sanitized = [];

        foreach ($content as $groupSlug => $groupData) {
            $cleanSlug = sanitize_key((string) $groupSlug);

            if (is_array($groupData)) {
                // If it's an indexed array (Collection) or associative array (Single)
                $sanitized[$cleanSlug] = $this->sanitizeRecursive($groupData);
            } else {
                $sanitized[$cleanSlug] = sanitize_text_field((string) $groupData);
            }
        }

        return $sanitized;
    }

    /**
     * Generic recursive sanitization helper preserving array structure.
     */
    private function sanitizeRecursive(mixed $value): mixed {
        if (is_array($value)) {
            $clean = [];
            foreach ($value as $k => $v) {
                $cleanKey = is_string($k) ? sanitize_text_field($k) : $k;
                $clean[$cleanKey] = $this->sanitizeRecursive($v);
            }
            return $clean;
        }

        if (is_numeric($value) || is_bool($value) || is_null($value)) {
            return $value;
        }

        if (is_string($value)) {
            // Check if string contains line breaks (preserve for textareas)
            if (str_contains($value, "\n")) {
                return sanitize_textarea_field($value);
            }
            return sanitize_text_field($value);
        }

        return $value;
    }
}
