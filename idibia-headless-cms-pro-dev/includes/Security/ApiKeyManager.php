<?php

declare(strict_types=1);

namespace Idibia\Headless\Security;

use WP_REST_Request;

class ApiKeyManager {
    public const OPTION_NAME = 'idibia_cms_api_keys';

    /**
     * Retrieve all saved keys.
     */
    public static function getKeys(): array {
        $keys = get_option(self::OPTION_NAME, []);
        return is_array($keys) ? $keys : [];
    }

    /**
     * Generate a new API key.
     * Returns an array with the plain key (to show once) and the stored key data.
     */
    public static function generateKey(string $name, string $type = 'secret'): array {
        $plain_token = bin2hex(random_bytes(16));
        $prefix = $type === 'public' ? 'idb_pub_' : 'idb_secret_';
        $plain_key = $prefix . $plain_token;
        
        $hashed_key = hash('sha256', $plain_key);
        
        $keyData = [
            'id'         => uniqid('key_'),
            'name'       => sanitize_text_field($name),
            'type'       => $type,
            'hashed_key' => $hashed_key,
            'prefix'     => $prefix . '****' . substr($plain_token, -4),
            'created_at' => gmdate('c'),
        ];

        $keys = self::getKeys();
        $keys[] = $keyData;
        update_option(self::OPTION_NAME, $keys, false);

        return [
            'plain_key' => $plain_key,
            'key_data'  => $keyData,
        ];
    }

    /**
     * Revoke an API key by its ID.
     */
    public static function revokeKey(string $keyId): bool {
        $keys = self::getKeys();
        $initialCount = count($keys);
        
        $keys = array_filter($keys, fn($k) => $k['id'] !== $keyId);
        
        if (count($keys) !== $initialCount) {
            update_option(self::OPTION_NAME, array_values($keys), false);
            return true;
        }
        
        return false;
    }

    /**
     * Validate a request against stored API keys.
     * @param array $allowed_types Array of allowed key types (e.g., ['secret', 'public'])
     */
    public static function validate(WP_REST_Request $request, array $allowed_types = ['secret']): bool {
        $auth_header = $request->get_header('authorization');
        // Match old idb_live_ keys or new idb_secret_/idb_pub_ keys
        if (!$auth_header || !preg_match('/Bearer\s+(idb_(live|secret|pub)_[a-zA-Z0-9]+)/i', $auth_header, $matches)) {
            return false;
        }

        $provided_key = $matches[1];
        $provided_hash = hash('sha256', $provided_key);

        $keys = self::getKeys();
        foreach ($keys as $keyData) {
            if (hash_equals($keyData['hashed_key'], $provided_hash)) {
                // Determine the key type (fallback to secret for old keys)
                $keyType = $keyData['type'] ?? 'secret';
                
                if (in_array($keyType, $allowed_types, true)) {
                    return true;
                }
                return false;
            }
        }

        return false;
    }
}
