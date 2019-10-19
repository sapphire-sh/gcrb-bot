import Twit from 'twit';

import {
	composeTweet,
} from '~/helpers';

export class Tweeter {
	private readonly twit: Twit[];

	public constructor(config: Twit.Options[]) {
		this.twit = config.map(e => new Twit(e));
	}

	public async tweetItem(item: any): Promise<void> {
		const status = composeTweet(item);

		try {
			const twit = this.twit[item.platform + 1];
			await twit.post('statuses/update', { status });
		}
		catch (error) {
			console.log(error);
		}
	}
}
