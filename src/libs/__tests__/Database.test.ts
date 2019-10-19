import faker from 'faker';

import {
	PlatformType,
} from '~/constants';

import {
	Item,
} from '~/models';

import {
	copy,
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

	const id = faker.random.uuid();
	const platform = getRandomPlatform();
	const prevItem: Item = {
		id,
		date: faker.date.recent().toString(),
		title: faker.random.uuid(),
		platform,
		applicant: faker.random.uuid(),
		rating: faker.random.number(),
		code: faker.random.uuid(),
		tweet: 0,
	};

	let database: Database;

	beforeEach(async () => {
		database = new Database();
		await database.insertItem(prevItem);
	});

	test('key', () => {
		const key = database.key(id);
		expect(key).toBe(`gcrb_bot:${id}`);
	});

	describe('getItem', () => {
		test('success', async () => {
			const item = await database.getItem(id);
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
			const item: Item = {
				id: faker.random.uuid(),
				date: faker.date.recent().toString(),
				title: faker.random.uuid(),
				platform: getRandomPlatform(),
				applicant: faker.random.uuid(),
				rating: faker.random.number(),
				code: faker.random.uuid(),
				tweet: 0,
			};
			const res = await database.insertItem(item);
			expect(res).toBe(true);

			const nextItem = await database.getItem(item.id);
			expect(nextItem).toEqual(item);
		});

		test('success - update', async () => {
			const item = copy(prevItem);
			item.tweet = 1;

			const res = await database.insertItem(item);
			expect(res).toBe(true);

			const nextItem = await database.getItem(id);
			expect(nextItem).not.toBeNull();
			expect(nextItem!.tweet).toBe(1);
			expect(prevItem.tweet).toBe(0);
		});

		test('failure - duplicate', async () => {
			const item = copy(prevItem);

			const res = await database.insertItem(item);
			expect(res).toBe(false);
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

			const res = await database.insertItem(item);
			expect(res).toBe(true);

			const items = await database.getUntweetedItems(platform);
			expect(items).toHaveLength(0);
		});
	});
});
