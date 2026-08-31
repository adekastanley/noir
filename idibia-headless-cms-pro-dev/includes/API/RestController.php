<?php

declare(strict_types=1);

namespace Idibia\Headless\API;

use WP_REST_Controller;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * Base REST Controller for Idibia Headless CMS.
 */
abstract class RestController extends WP_REST_Controller {
    protected $namespace = 'idibia/v1';

    /**
     * Permission callback to check if current user has administrative permissions.
     */
    public function checkAdminPermission(WP_REST_Request $request): bool|WP_Error {
        if (!current_user_can('manage_options')) {
            return new WP_Error(
                'rest_forbidden',
                __('Sorry, you do not have permission to manage Idibia CMS schemas.', 'idibia-headless'),
                ['status' => rest_authorization_required_code()]
            );
        }

        return true;
    }

    /**
     * Standard success JSON response helper.
     */
    protected function success(mixed $data, int $status = 200): WP_REST_Response {
        return new WP_REST_Response([
            'success' => true,
            'data'    => $data,
        ], $status);
    }

    /**
     * Standard error JSON response helper.
     */
    protected function error(string $message, string $code = 'idibia_error', int $status = 400): WP_Error {
        return new WP_Error($code, $message, ['status' => $status]);
    }
}
