import { dictionary } from "../lib/dictionary";
import { romanNumerals } from "../lib/util";

interface Props {
	chapter: string;
	word: string | null;
}

export default function OgTemplate(props: Props) {
	const chapter = dictionary.chapters[props.chapter];
	const word = props.word ? dictionary.get(props.word) : null;

	const bgVariant = Math.floor(Math.random() * 4 + 1);

	const background = (
		<img
			tw="absolute size-full"
			src={`${import.meta.env.PUBLIC_BASE_URL}/og-background-${bgVariant}.jpg`}
			alt=""
			width="1200"
			height="630"
		/>
	);

	if (word) {
		return (
			<>
				{background}

				<div
					tw="flex h-full flex-col justify-center px-16 text-white"
					style={{ fontFamily: "Inter" }}
				>
					<h1 tw="mb-0 text-7xl font-black">{word.name}</h1>

					<p tw="text-2xl text-neutral-400">
						{word.definition.replace(/<[^>]+(>|$)/g, "")}
					</p>
				</div>
			</>
		);
	}

	return (
		<>
			{background}

			<div tw="flex size-full items-center justify-center text-white">
				<div tw="flex flex-col px-16">
					<span tw="text-4xl" style={{ fontFamily: "Playfair" }}>
						{romanNumerals[chapter.id]}
					</span>

					<h1 tw="my-3 text-8xl font-black mb-0" style={{ fontFamily: "Inter" }}>
						{chapter.name.toUpperCase()}
					</h1>

					<p tw="text-3xl leading-none mb-0" style={{ fontFamily: "Inter" }}>
						{chapter.description}
					</p>
				</div>
			</div>
		</>
	);
}
