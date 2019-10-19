import {
	PLATFORM_STRINGS,
	RATING_STRINGS,
} from '~/constants';

import {
	Item,
} from '~/models';

export function composeTweet(item: Item): string {
	const date = item.date;
	const title = item.title;
	const platform = PLATFORM_STRINGS[item.platform];
	const rating = RATING_STRINGS[item.rating];
	const applicant = item.applicant;

	const fragments = [
		`[${date}]`,
		`[${platform}]`,
		`[${title}]`,
		`[${applicant}]`,
		`[${rating}]`,
		`https://www.grac.or.kr/Statistics/Popup/Pop_ReasonInfo.aspx?${item.id}`,
		`@GameRatingInfo`,
	];

	return fragments.join('\n');
}
