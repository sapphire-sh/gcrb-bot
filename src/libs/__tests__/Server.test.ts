import request from 'supertest';

import {
	PlatformType,
} from '~/constants';

import {
	Item,
} from '~/models';

import {
	Server,
} from '../Server';

describe('libs/Server', () => {
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

	class TestServer extends Server {
		protected async getItems(): Promise<Item[]> {
			return [item];
		}
	}

	const server = new TestServer();

	test('/', async () => {
		const { body } = await request(server.app).get('/').expect(200);

		expect(body).toBe(true);
	});

	test('/api', async () => {
		const { body } = await request(server.app).get('/api').expect(200);

		expect(body).toHaveLength(1);
		expect(body).toContainEqual(item);
	});
});
