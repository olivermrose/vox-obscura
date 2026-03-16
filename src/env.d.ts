/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
	readonly PUBLIC_BASE_URL: string;
}

namespace React {
	interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
		tw?: string;
	}
}
