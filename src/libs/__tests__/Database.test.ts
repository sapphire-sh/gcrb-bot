import faker from 'faker';

import {
	PlatformType,
} from '~/constants';

import {
	Item,
} from '~/models';

import {
	copy,
	getDateString,
} from '~/helpers';

import {
	Database,
} from '../Database';

describe('libs/Database', () => {
	function getRandomPlatform(): PlatformType {
		const types = Object.values(PlatformType);
		const idx = faker.random.number(types.length);
		return types[idx];
	}

	function getRandomItem(): Item {
		return {
			id: faker.random.uuid(),
			date: getDateString(faker.date.recent()),
			title: faker.random.uuid(),
			platform,
			applicant: faker.random.uuid(),
			rating: faker.random.number(),
			code: faker.random.uuid(),
			tweet: 0,
		};
	}

	const platform = getRandomPlatform();
	const prevItem = getRandomItem();

	const database = new Database();

	beforeEach(async () => {
		await database.flush();
		await database.insertItem(prevItem);
	});

	describe('getItem', () => {
		test('success', async () => {
			const item = await database.getItem(prevItem.id);
			expect(item).not.toBeNull();
		});

		test('failure - not found', async () => {
			const id = faker.random.uuid();
			const item = await database.getItem(id);
			expect(item).toBeNull();
		});
	});

	describe('insertItem', () => {
		test('success', async () => {
			const item = getRandomItem();

			const res = await database.insertItem(item);
			expect(res).toBe(true);

			const nextItem = await database.getItem(item.id);
			expect(nextItem).toEqual(item);
		});

		test('failure - duplicate', async () => {
			const item = copy(prevItem);

			const res = await database.insertItem(item);
			expect(res).toBe(false);

			const nextItem = await database.getItem(item.id);
			expect(nextItem).toEqual(prevItem);
		});
	});

	describe('updateItem', () => {
		test('success', async () => {
			const item = copy(prevItem);
			item.tweet = 1;

			const res = await database.updateItem(item);
			expect(res).toBe(true);

			const nextItem = await database.getItem(prevItem.id);
			expect(nextItem).not.toBeNull();
			expect(nextItem!.tweet).toBe(1);
		});

		test('failure', async () => {
			const item = copy(prevItem);
			item.tweet = 1;

			{
				const res = await database.updateItem(item);
				expect(res).toBe(true);
			}

			item.tweet = 0;
			const res = await database.updateItem(item);
			expect(res).toBe(false);

			const nextItem = await database.getItem(prevItem.id);
			expect(nextItem).not.toBeNull();
			expect(nextItem!.tweet).toBe(1);
		});
	});

	describe('getUntweetedItems', () => {
		test('success', async () => {
			const items = await database.getUntweetedItems(platform);
			expect(items).toHaveLength(1);
			expect(items[0]).toEqual(prevItem);
		});

		test('success - no items', async () => {
			const item = copy(prevItem);
			item.tweet = 1;

			const res = await database.updateItem(item);
			expect(res).toBe(true);

			const items = await database.getUntweetedItems(platform);
			expect(items).toHaveLength(0);
		});
	});
});
