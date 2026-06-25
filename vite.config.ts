// @lovable.dev/vite-tanstack-config already includes the following - do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { PluginOption } from "vite";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this - wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
   cloudflare: {
    assets: {
      directory: "./dist/client",
      binding: "ASSETS",
    },
  },
   vite: {
    plugins: [
      sitemap({
        hostname: "https://supersonicdynamicservices.nl",
        outDir: 'dist/client',
        dynamicRoutes: [
          "/",
          "/about",
          "/services",
          "/contact",
          "/faqs",
          "/terms",
          "/privacy",
          "/shop/",
        ],
      }),
    ],
  },
});

function sitemap(config: {
  hostname: string;
  outDir: string;
  dynamicRoutes: string[];
}): PluginOption {
  return {
    name: "vite-plugin-sitemap",
    closeBundle: async () => {
      const urls = config.dynamicRoutes.map((route) => {
        const path = route.startsWith("/") ? route : `/${route}`;
        return `  <url><loc>${config.hostname}${path}</loc></url>`;
      });

      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
        `${urls.join("\n")}\n` +
        `</urlset>\n`;

      const filePath = resolve(process.cwd(), config.outDir, "sitemap.xml");
      await writeFile(filePath, xml, "utf8");

    },
  };
}
