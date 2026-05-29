// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { spawnSync } from "node:child_process";
import type { Plugin } from "vite";

/**
 * Build-time a11y gate: fails the build if any icon-only <Button size="icon">
 * or <Toggle size="icon"> is missing an accessible name (aria-label / title /
 * aria-labelledby). Runs once at buildStart so violations stop the build
 * before bundling.
 */
function iconButtonA11yPlugin(): Plugin {
  return {
    name: "lovable:icon-button-a11y",
    apply: "build",
    buildStart() {
      const r = spawnSync("node", ["scripts/check-icon-buttons.mjs"], {
        stdio: "inherit",
      });
      if (r.status !== 0) {
        this.error(
          "Accessibility check failed: icon-only buttons missing aria-label. " +
            "See errors above and add aria-label / title to each flagged Button/Toggle.",
        );
      }
    },
  };
}

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [iconButtonA11yPlugin()],
  },
});
