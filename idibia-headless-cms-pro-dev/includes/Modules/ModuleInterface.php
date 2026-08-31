<?php

declare(strict_types=1);

namespace Idibia\Headless\Modules;

interface ModuleInterface {
    public function slug(): string;
    public function label(): string;
    public function description(): string;
    public function boot(): void;
}
