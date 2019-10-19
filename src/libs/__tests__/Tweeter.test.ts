import {
	PlatformType,
} from '~/constants';

import {
	Item,
} from '~/models';

import {
	composeTweet,
} from '~/helpers';

import {
	Tweeter,
} from '../Tweeter';

describe('libs/Tweeter', () => {
	class TestTweeter extends Tweeter {
		public platform: PlatformType | null = null;
		public status: string | null = null;

		public constructor() {
			super([]);
		}

		protected async tweet(platform: PlatformType, status: string): Promise<void> {
			this.platform = platform;
			this.status = status;
		}
	}

	const item: Item = {
		id: '2b0265a8f0dc02c97e754b2ea22c1f63cecd98f227eaeaf17ed258610ac557e8',
		date: '2016-09-28',
		title: 'PS4_Kitchen(키친)',
		applicant: '게임피아(주)',
		rating: 3,
		platform: PlatformType.CONSOLE,
		code: 'CC-NV-160928-001',
		tweet: 0,
	};

	test('getPlatformIndex', () => {
		const tweeter = new TestTweeter();

		const platforms = Object.values(PlatformType);
		for (let i = 0; i < platforms.length; ++i) {
			const platform = platforms[i];
			const index = tweeter.getPlatformIndex(platform);

			expect(index).toBe(i);
		}
	});

	test('tweetItem', async () => {
		const tweeter = new TestTweeter();

		await tweeter.tweetItem(item);

		const status = composeTweet(item);

		expect(tweeter.platform).toBe(item.platform);
		expect(tweeter.status).toBe(status);
	});
});
