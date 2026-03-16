import fs from "node:fs/promises";
import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	integrations: [svelte()],
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
	},
});
