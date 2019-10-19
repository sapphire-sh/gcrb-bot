import faker from 'faker';

import {
	BASE_URL,
} from '~/constants';

import {
	getDateString,
} from '~/helpers';

import {
	getURL,
} from '../getURL';

describe('helpers/getURL', () => {
	test('success', () => {
		const type = faker.random.uuid();
		const pageindex = faker.random.number();
		const startdate = getDateString(faker.date.recent());
		const enddate = getDateString(faker.date.recent());
		const platform = faker.random.uuid();

		const url = getURL({ type, pageindex, startdate, enddate, platform });
		const params = Object.entries({ type, pageindex, startdate, enddate, platform }).map(([key, value]) => {
			return `${key}=${encodeURIComponent(value)}`;
		}).join('&');
		expect(url).toBe(`${BASE_URL}?${params}`);
	});
});
