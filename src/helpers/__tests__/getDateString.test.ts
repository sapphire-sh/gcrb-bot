import faker from 'faker';

import {
	getDateString,
} from '~/helpers';

describe('helpers/getDate', () => {
	test('success', () => {
		const date = faker.date.recent();
		const dateString = getDateString(date);
		expect(dateString).toBe([
			date.getUTCFullYear(),
			`${(date.getUTCMonth() + 1)}`.padStart(2, '0'),
			date.getUTCDate(),
		].join('-'));
	});
});
