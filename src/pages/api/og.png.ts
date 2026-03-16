import type { APIRoute } from "astro";
import { Buffer } from "node:buffer";
import { ImageResponse } from "@takumi-rs/image-response/wasm";
import module from "@takumi-rs/wasm/takumi_wasm_bg.wasm";
import Inter400 from "../../assets/InterDisplay-400.ttf";
import Inter900 from "../../assets/InterDisplay-900.ttf";
import Playfair600 from "../../assets/PlayfairDisplay-600.ttf";
import OgTemplate from "../../components/OgTemplate.jsx";

export const prerender = false;

const fonts = [
	{
		name: "Inter",
		data: Buffer.from(Inter400),
		weight: 400,
	},
	{
		name: "Inter",
		data: Buffer.from(Inter900),
		weight: 900,
	},
	{
		name: "Playfair",
		data: Buffer.from(Playfair600),
		weight: 600,
	},
];

export const GET: APIRoute = async ({ url }) => {
	const chapter = url.searchParams.get("chapter");
	const word = url.searchParams.get("word");

	if (!chapter) {
		return new Response("`chapter` parameter required", { status: 400 });
	}

	const node = OgTemplate({ chapter, word });

	return new ImageResponse(node, {
		module,
		width: 1200,
		height: 630,
		fonts,
		format: "webp",
		headers: {
			"Cache-Control": import.meta.env.DEV
				? "no-cache, no-store"
				: "public, immutable, no-transform, max-age=31536000",
		},
	});
};
