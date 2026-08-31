<?php

declare(strict_types=1);

namespace Idibia\Headless\API;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;

/**
 * Controller for Managing Content Group Schemas.
 */
class SchemaController extends RestController {
    public const OPTION_NAME = 'idibia_cms_schemas';
    protected $rest_base = 'schemas';

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
                    'callback'            => [$this, 'getSchemas'],
                    'permission_callback' => [$this, 'checkAdminPermission'],
                ],
                [
                    'methods'             => WP_REST_Server::CREATABLE,
                    'callback'            => [$this, 'saveSchemas'],
                    'permission_callback' => [$this, 'checkAdminPermission'],
                    'args'                => [
                        'groups' => [
                            'description'       => __('Array of content group schemas', 'idibia-headless'),
                            'type'              => 'array',
                            'required'          => true,
                            'validate_callback' => [$this, 'validateGroupsParam'],
                        ],
                    ],
                ],
            ]
        );
    }

    /**
     * Retrieve all saved schemas from wp_options.
     */
    public function getSchemas(WP_REST_Request $request): WP_REST_Response {
        $raw = get_option(self::OPTION_NAME, null);

        if ($raw === null || $raw === false) {
            $defaultData = [
                'version'   => IDIBIA_VERSION,
                'groups'    => [],
                'updatedAt' => null,
            ];
            return $this->success($defaultData);
        }

        if (is_string($raw)) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                return $this->success($decoded);
            }
        }

        if (is_array($raw)) {
            return $this->success($raw);
        }

        return $this->success([
            'version'   => IDIBIA_VERSION,
            'groups'    => [],
            'updatedAt' => null,
        ]);
    }

    /**
     * Validate and persist schemas into wp_options.
     */
    public function saveSchemas(WP_REST_Request $request): WP_REST_Response|WP_Error {
        $params = $request->get_json_params();

        if (empty($params) || !isset($params['groups']) || !is_array($params['groups'])) {
            return $this->error(__('Invalid schema payload format.', 'idibia-headless'), 'invalid_payload', 400);
        }

        $sanitizedGroups = $this->sanitizeGroups($params['groups']);

        $payload = [
            'version'   => IDIBIA_VERSION,
            'groups'    => $sanitizedGroups,
            'updatedAt' => gmdate('c'),
        ];

        $jsonEncoded = wp_json_encode($payload);

        if ($jsonEncoded === false) {
            return $this->error(__('Failed to encode schema JSON.', 'idibia-headless'), 'json_encode_error', 500);
        }

        // Store as single JSON string in wp_options (autoload disabled)
        $updated = update_option(self::OPTION_NAME, $jsonEncoded, false);

        // Note: update_option returns false if value hasn't changed, which is still successful
        return $this->success($payload);
    }

    /**
     * Validate the groups array parameter.
     */
    public function validateGroupsParam($param, $request, $key): bool {
        return is_array($param);
    }

    /**
     * Recursively sanitize content groups and their nested fields.
     */
    private function sanitizeGroups(array $groups): array {
        $sanitized = [];

        foreach ($groups as $group) {
            if (!is_array($group)) {
                continue;
            }

            $id = sanitize_text_field((string) ($group['id'] ?? uniqid('grp_', true)));
            $title = sanitize_text_field((string) ($group['title'] ?? 'Untitled Group'));
            $slug = sanitize_key((string) ($group['slug'] ?? sanitize_title($title)));
            $kind = in_array(($group['kind'] ?? 'single'), ['single', 'collection'], true) ? $group['kind'] : 'single';
            $access_level = in_array(($group['access_level'] ?? 'public'), ['public', 'protected'], true) ? $group['access_level'] : 'public';
            $description = sanitize_textarea_field((string) ($group['description'] ?? ''));
            $fields = is_array($group['fields'] ?? null) ? $this->sanitizeFields($group['fields']) : [];

            $sanitized[] = [
                'id'          => $id,
                'title'       => $title,
                'slug'        => $slug,
                'kind'        => $kind,
                'access_level'=> $access_level,
                'description' => $description,
                'fields'      => $fields,
            ];
        }

        return $sanitized;
    }

    /**
     * Recursively sanitize fields and repeater sub-fields.
     */
    private function sanitizeFields(array $fields): array {
        $sanitized = [];
        $validTypes = ['text', 'textarea', 'image', 'repeater'];

        foreach ($fields as $field) {
            if (!is_array($field)) {
                continue;
            }

            $id = sanitize_text_field((string) ($field['id'] ?? uniqid('fld_', true)));
            $label = sanitize_text_field((string) ($field['label'] ?? 'Untitled Field'));
            $name = sanitize_key((string) ($field['name'] ?? sanitize_title($label)));
            $type = in_array(($field['type'] ?? 'text'), $validTypes, true) ? $field['type'] : 'text';
            $description = sanitize_textarea_field((string) ($field['description'] ?? ''));
            $placeholder = sanitize_text_field((string) ($field['placeholder'] ?? ''));

            $fieldData = [
                'id'          => $id,
                'label'       => $label,
                'name'        => $name,
                'type'        => $type,
                'description' => $description,
                'placeholder' => $placeholder,
            ];

            // If repeater, recursively sanitize subFields
            if ($type === 'repeater' && isset($field['subFields']) && is_array($field['subFields'])) {
                $fieldData['subFields'] = $this->sanitizeFields($field['subFields']);
            }

            $sanitized[] = $fieldData;
        }

        return $sanitized;
    }
}
