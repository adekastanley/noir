<?php

declare(strict_types=1);

namespace Idibia\Headless\Modules;

class JwtAuthModule implements ModuleInterface {
    public function slug(): string {
        return 'jwt_auth';
    }

    public function label(): string {
        return 'JWT Authentication';
    }

    public function description(): string {
        return 'Adds JSON Web Token (JWT) authentication for stateless API access alongside API key auth.';
    }

    public function boot(): void {
        // TODO: Future implementation of JWT generation, validation routes, and authentication hooks.
    }
}
