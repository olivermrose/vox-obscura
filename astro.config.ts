import fs from "node:fs/promises";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	integrations: [react()],
	adapter: cloudflare(),
	vite: {
		plugins: [
			tailwindcss(),
			{
				name: "vite-plugin-fonts",
				async transform(code: string, id: string) {
					if (id.endsWith(".ttf") || id.endsWith(".woff")) {
						const buffer = await fs.readFile(id);

						return {
							code: `export default ${JSON.stringify(buffer)}`,
						};
					}
				},
			},
		],
		optimizeDeps: {
			exclude: ["@takumi-rs/core"],
		},
		ssr: {
			external: ["@takumi-rs/core"],
		},
	},
});
