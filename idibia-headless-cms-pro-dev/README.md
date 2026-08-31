# Idibia Headless CMS (WordPress Plugin)

A proprietary, high-performance headless CMS and schema builder designed to replace ACF and default WordPress post editing with a unified, distraction-free SPA for modern Vite + React + TanStack Router frontends.

---

## 📁 Directory Structure

```
idibia-headless-cms/
├── idibia-headless.php             # Main plugin bootstrap file
├── includes/                       # PHP 8+ Object-Oriented Backend (Idibia\Headless)
│   ├── Autoloader.php              # Standalone PSR-4 autoloader (zero dependencies needed)
│   ├── Core/
│   │   ├── Plugin.php              # Main orchestrator singleton
│   │   ├── AdminMenu.php           # Registers "Idibia CMS" menu in WordPress Admin
│   │   └── AssetLoader.php         # Dual-mode asset enqueuing (Vite HMR dev / Build prod)
│   ├── API/                        # (Step 2) REST API controllers for idibia/v1/
│   └── Models/                     # (Step 2) Data models for schemas and content
├── admin/                          # React 18 + TypeScript + Tailwind SPA
│   ├── src/
│   │   ├── main.tsx                # Mounts React to #idibia-cms-root
│   │   ├── App.tsx                 # Tabbed dashboard (Developer vs Client)
│   │   ├── index.css               # Scoped Tailwind CSS
│   │   ├── types/wp.d.ts           # WordPress global declarations & idibiaSettings
│   │   └── components/HelloWorld.tsx # Diagnostic status widget
│   ├── vite.config.ts              # Bundles directly to ../build/
│   └── tailwind.config.js          # Scoped to #idibia-cms-root (no WP admin UI clash)
└── build/                          # Compiled production bundles
```

---

## 🚀 Getting Started

### 1. Install & Build Frontend Assets
```bash
cd admin
npm install
npm run build
```

### 2. Development Mode with Live Hot Reload (HMR)
When developing inside your local WordPress environment:
1. Ensure `define('WP_DEBUG', true);` is set in your `wp-config.php`.
2. Start the Vite development server:
   ```bash
   cd admin
   npm run dev
   ```
3. Navigate to `Idibia CMS` in the WordPress admin panel. The page will automatically hot-reload via Vite at `http://localhost:5173`.

### 3. Production Deployment
Run:
```bash
cd admin
npm run build
```
Copy or symlink the `idibia-headless-cms` folder into your WordPress site's `wp-content/plugins/` directory and activate the plugin via the WordPress Admin Plugins dashboard.
