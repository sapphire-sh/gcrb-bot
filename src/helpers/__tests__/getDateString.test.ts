import faker from 'faker';

import {
	getDateString,
} from '../getDateString';

describe('helpers/getDate', () => {
	test('success', () => {
		const date = faker.date.recent();
		const dateString = getDateString(date);
		expect(dateString).toBe([
			date.getUTCFullYear(),
			`${(date.getUTCMonth() + 1)}`.padStart(2, '0'),
			`${(date.getUTCDate())}`.padStart(2, '0'),
		].join('-'));
	});

	test('success - date diff +', () => {
		const dateDiff = 100;
		const date = faker.date.recent();
		const dateString = getDateString(date, dateDiff);
		const nextDate = new Date(date);
		nextDate.setDate(nextDate.getDate() + dateDiff);
		expect(dateString).toBe([
			nextDate.getUTCFullYear(),
			`${(nextDate.getUTCMonth() + 1)}`.padStart(2, '0'),
			`${(nextDate.getUTCDate())}`.padStart(2, '0'),
		].join('-'));
	});

	test('success - date diff -', () => {
		const dateDiff = -100;
		const date = faker.date.recent();
		const dateString = getDateString(date, dateDiff);
		const nextDate = new Date(date);
		nextDate.setDate(nextDate.getDate() + dateDiff);
		expect(dateString).toBe([
			nextDate.getUTCFullYear(),
			`${(nextDate.getUTCMonth() + 1)}`.padStart(2, '0'),
			`${(nextDate.getUTCDate())}`.padStart(2, '0'),
		].join('-'));
	});
});
