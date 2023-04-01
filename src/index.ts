import LIVE from "./features/live.ts";
import EMOJI from "./features/emoji.ts";



export const start = async (): Promise<void> => {
	await LIVE.start();
	await EMOJI.start();
};
export const stop = async (): Promise<void> => {
	await LIVE.stop();
	await EMOJI.stop();
};