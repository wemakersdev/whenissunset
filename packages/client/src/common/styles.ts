import { rootElement } from "./basicStores";


export const getCSSVar = (name: string) => {
	const cssVar = getComputedStyle(rootElement.get() as any).getPropertyValue(`--${name}`);
	return cssVar;
}

export const getHslColor = (variableName: string) => {
	const cssVar = getCSSVar(variableName);
	return `hsl(${cssVar})`;
}


export enum UiThemes{
	light = "light",
	dark = "dark",
	cupcake = "cupcake",
	bumblebee = "bumblebee",
	emerald = "emerald",
	corporate = "corporate",
	synthwave = "synthwave",
	retro = "retro",
	cyberpunk = "cyberpunk",
	valentine = "valentine",
	halloween = "halloween",
	garden = "garden",
	forest = "forest",
	aqua = "aqua",
	lofi = "lofi",
	pastel = "pastel",
	fantasy = "fantasy",
	wireframe = "wireframe",
	black = "black",
	luxury = "luxury",
	dracula = "dracula",
	cmyk = "cmyk",
	autumn = "autumn",
	business = "business",
	acid = "acid",
	lemonade = "lemonade",
	night = "night",
	coffee = "coffee",
	winter = "winter",
}