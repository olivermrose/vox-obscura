import type { Node } from "three/webgpu";
import {
	color,
	cos,
	dot,
	float,
	fract,
	max,
	mix,
	pow,
	sin,
	smoothstep,
	time,
	uniform,
	uv,
	vec2,
	vec3,
	vec4,
	viewportSize,
} from "three/tsl";

export function fragment(options?: { speed: number }) {
	const speed = uniform(options?.speed ?? 1);

	const color1 = color("#33689c"); // blue
	const color2 = color("#1d917f"); // teal
	const color3 = color("#8232aa"); // purple
	const color4 = color("#999c36"); // yellow
	const color5 = color("#d12975"); // pink
	const color6 = color("#e6ff07"); // neon

	const baseUV = uv();

	const correctedUV = correctUV();
	const distortedUV = distort(baseUV, 0.12, 0.5, 50);

	// Gamma correction
	const correctedColor1 = pow(color1, float(2.2));
	const correctedColor2 = pow(color2, float(2.2));
	const correctedColor3 = pow(color3, float(2.2));
	const correctedColor4 = pow(color4, float(2.2));

	const gradient1 = mix(correctedColor1, correctedColor2, baseUV.x);
	const gradient2 = mix(correctedColor4, correctedColor3, baseUV.x);
	const finalGradient = mix(gradient1, gradient2, baseUV.y);

	const waveX = distortedUV.x.sub(0.5);
	const waveY = distortedUV.y.sub(0.5);
	const waveInput = waveY.mul(waveX).add(waveY.mul(waveX)).negate();
	const wave = float(1).add(
		float(0.5).mul(
			sin(
				waveInput.add(time.mul(speed).mul(0.025)).div(0.025), // Speed modulation here
			),
		),
	);

	const edge = edgeMask(0.4, 1, 0.2, -0.1);
	const waveWithEdge = vec3(wave, wave, wave).mul(edge).mul(1.5);
	const colorMix = mix(color6.mul(0.01), color5.mul(0.1), baseUV.y.mul(baseUV.x));

	const finalColor = vec4(
		colorMix.add(finalGradient.mul(waveWithEdge)).sub(grain(correctedUV, 0.5)),
		1,
	);

	return glow(finalColor, color2, 0.15, 0.3, 2);
}

function correctUV() {
	const offset = vec2(0, 0);
	const aspectRatio = viewportSize.x.div(viewportSize.y);

	const baseUV = uv();
	const offsetUV = vec2(baseUV.x.add(offset.x), baseUV.y.add(offset.y));

	// Correct for aspect ratio by multiplying the x-coordinate by the aspect ratio
	return vec2(offsetUV.x.mul(aspectRatio), offsetUV.y);
}

function distort(uv: Node, intensity: number, frequency: number, speed: number) {
	const goldenRatio = speed * 1.618033988749895;
	const eulerNumber = speed * Math.E;

	const xMul = (Math.sin(speed) + 2) * 5;
	const yMul = (Math.cos(speed) + 2) * 5;

	const dist1 = vec2(
		sin(uv.x.mul(frequency).mul(xMul).add(time.mul(0.1)).add(goldenRatio)),
		cos(uv.y.mul(frequency).mul(xMul).add(time.mul(0.1)).add(eulerNumber)),
	);

	const dist2 = vec2(
		sin(uv.y.mul(frequency).mul(yMul).add(time.mul(0.05)).add(eulerNumber)),
		cos(uv.x.mul(frequency).mul(yMul).add(time.mul(0.05)).add(goldenRatio)),
	);

	return uv.add(dist1.add(dist2).mul(intensity));
}

function edgeMask(inset: number, softness: number, offsetX: number, offsetY: number) {
	const baseUV = uv();

	// Offset and scale the UV coordinates. The .sub(0.5).mul(2)
	// transforms the UVs from [0, 1] to [-1, 1]. The offsetX and
	// offsetY are then applied *before* the scaling, so they operate
	// in the original [0, 1] UV space.
	const offsetXNode = float(offsetX);
	const offsetYNode = float(offsetY);

	const scaledX = baseUV.x.sub(0.5).sub(offsetXNode).mul(2);
	const scaledY = baseUV.y.sub(0.5).add(offsetYNode).mul(2);

	// Calculate the distance from the center (0, 0) in the scaled UV space.
	const distance = scaledX.mul(scaledX).add(scaledY.mul(scaledY)).sqrt();

	// The edge starts at 1 - inset.
	// The edge ends (goes to 0) at (1 - inset) + softness.
	// Multiply the distance by (1 + softness) to make the edge
	// mask slightly "tighter", avoiding artifacts at the corners.
	const edgeStart = float(1).sub(float(inset));
	const edgeEnd = edgeStart.add(float(softness));

	const distanceScaled = distance.mul(float(1).add(float(softness)));

	return float(1).sub(smoothstep(edgeStart, edgeEnd, distanceScaled));
}

function glow(
	inputColor: Node,
	glowColor: Node,
	threshold: number,
	softness: number,
	intensity: number,
) {
	const brightness = max(max(inputColor.r, inputColor.g), inputColor.b);

	const glowAmount = smoothstep(threshold, threshold + softness, brightness).mul(intensity);

	return inputColor.add(glowColor.mul(glowAmount));
}

function grain(uv: Node, strength: number) {
	return fract(sin(dot(uv, vec2(12.12345, 78.12345))).mul(40000.12345))
		.mul(strength)
		.mul(0.10012345);
}
