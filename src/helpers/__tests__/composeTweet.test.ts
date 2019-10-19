import {
	Item,
} from '~/models';

import {
	composeTweet,
} from '../composeTweet';

describe('helpers/composeTweet', () => {
	const item: Item = {
		id: '2b0265a8f0dc02c97e754b2ea22c1f63cecd98f227eaeaf17ed258610ac557e8',
		date: '2016-09-28',
		title: 'PS4_Kitchen(키친)',
		applicant: '게임피아(주)',
		rating: 3,
		platform: '03',
		code: 'CC-NV-160928-001',
		tweet: 0,
	};

	test('success', () => {
		expect(composeTweet(item)).toBe([
			'[2016-09-28]',
			'[비디오 게임]',
			'[PS4_Kitchen(키친)]',
			'[게임피아(주)]',
			'[청소년 이용불가]',
			'https://www.grac.or.kr/Statistics/Popup/Pop_ReasonInfo.aspx?2b0265a8f0dc02c97e754b2ea22c1f63cecd98f227eaeaf17ed258610ac557e8',
			'@GameRatingInfo',
		].join('\n'));
	});
});
