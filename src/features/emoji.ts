import type { APIUser } from 'discord-api-types/v10';
import type { ToCamel } from "../../@types/extensions.d.ts";
declare type UserPremiumType = 0 | 1 | 2 | 3;

import { Injector, Logger, webpack } from 'replugged';
const logger = Logger.plugin("NitroBypass");
const inject = new Injector();



export default {
	async start() {
		const MessageActions = await webpack.waitForModule<{
			sendMessage: (channelId: string, message: any) => Promise<any>;
			editMessage: (guildId: string, channelId: string, message: any) => Promise<any>;
		}>(webpack.filters.byProps("jumpToMessage", "_sendMessage"));
		
		
		inject.before(MessageActions, "sendMessage", (props) => {
			const [channelId, message] = props;
			const invalidEmojis = message.validNonShortcutEmojis;

			if(invalidEmojis.length > 0) {
				invalidEmojis.forEach((emoji: any) => {
					if(emoji.url.startsWith("/assets/")) return;
					//const emojiName = emoji.allNamesString.replace(/~\d/g, '');
					const emojiFull = `<${emoji.animated ? 'a':''}${emoji.allNamesString}${emoji.id}>`;
					message.content = message.content.replace(emojiFull, `${emoji.url}&size=${48}`);
				});
			}
		});

		inject.before(MessageActions, "editMessage", (props) => {
			const [guildId, channelId, message] = props;
			const rawEmoji = message.content.match(/<(a)?:(.*)?:\d{18}>/g);

			if(rawEmoji !== null) {
				rawEmoji.forEach((emoji: string) => {
					const emojiUrl = `https://cdn.discordapp.com/emojis/${emoji.match(/\d{18}/g)![0]}?size=${48}`;
					message.content = message.content.replace(emoji, emojiUrl);
				});
			}
		});
	},
	async stop() {
		inject.uninjectAll();
	},
} as const;