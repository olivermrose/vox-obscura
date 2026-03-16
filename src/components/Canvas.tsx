import { useEffect, useRef, useState } from "react";
import { Renderer } from "../lib/renderer";
import { fragment } from "../lib/shader";

export default function Canvas() {
	const [mounted, setMounted] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		setMounted(true);

		if (!containerRef.current || !canvasRef.current) return;

		const renderer = new Renderer({
			container: containerRef.current,
			canvas: canvasRef.current,
			fragmentNode: fragment(),
		});

		return () => renderer.dispose();
	}, []);

	return (
		<div
			className={`fixed inset-0 -z-20 size-full overflow-clip transition-opacity duration-750 ease-in-out ${
				mounted ? "opacity-100" : "opacity-0"
			}`}
			ref={containerRef}
		>
			<canvas className="absolute top-0 left-0 size-full" ref={canvasRef}></canvas>
		</div>
	);
}
