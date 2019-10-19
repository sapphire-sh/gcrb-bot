import Twit from 'twit';

import {
	PlatformType,
} from '~/constants';

import {
	Item,
} from '~/models';

import {
	composeTweet,
} from '~/helpers';

export class Tweeter {
	private readonly twit: Twit[];

	public constructor(config: Twit.ConfigKeys[]) {
		this.twit = config.map(e => new Twit(e));
	}

	public getPlatformIndex(platform: PlatformType): number {
		const types = Object.values(PlatformType);
		return types.indexOf(platform);
	}

	protected getTwit(platform: PlatformType): Twit {
		const index = this.getPlatformIndex(platform);
		return this.twit[index + 1];
	}

	protected async tweet(platform: PlatformType, status: string): Promise<void> {
		const twit = this.getTwit(platform);
		await twit.post('statuses/update', { status });
	}

	public async tweetItem(item: Item): Promise<void> {
		try {
			const status = composeTweet(item);
			await this.tweet(item.platform, status);
		}
		catch (error) {
			console.log(error);
		}
	}
}
