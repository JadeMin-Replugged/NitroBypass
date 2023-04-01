import type { APIUser } from 'discord-api-types/v10';
import type { ToCamel } from "../../@types/extensions.d.ts";
declare type UserPremiumType = 0 | 1 | 2 | 3;

import { Injector, Logger, webpack } from 'replugged';
const logger = Logger.plugin("NitroBypass");

const getCurrentUser = async () => {
	const { getCurrentUser } = await webpack.waitForModule<{
		getCurrentUser: () => ToCamel<APIUser>;
	}>(webpack.filters.byProps("getCurrentUser"));

	return getCurrentUser();
};
let defaultPremiumType: UserPremiumType;



export default {
	async start() {
		const currentUser = await getCurrentUser();

		defaultPremiumType = currentUser.premiumType!;
		currentUser.premiumType = 2;
	},
	async stop() {
		const currentUser = await getCurrentUser();

		currentUser.premiumType = defaultPremiumType;
	}
} as const;