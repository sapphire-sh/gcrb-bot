import IORedis from 'ioredis';

import IORedisMock from 'ioredis-mock';

import {
	Item,
} from '~/models';

import {
	equals,
} from '~/helpers';

export class Database {
	private readonly redis: IORedis.Redis;

	public constructor() {
		if (__test) {
			this.redis = new IORedisMock();
		}
		else {
			this.redis = new IORedis(process.env.REDIS_HOST);
		}
	}

	public get key() {
		return `gcrb_bot`;
	}

	public async flush() {
		await this.redis.flushall();
	}

	public serializeItem(item: Item): string {
		return JSON.stringify(item);
	}

	public deserializeItem(value: string): Item | null {
		try {
			const item = JSON.parse(value);
			return item;
		}
		catch {
			return null;
		}
	}

	public async getItem(id: string): Promise<Item | null> {
		const res = await this.redis.hget(this.key, id);

		if (res === null) {
			return null;
		}
		return this.deserializeItem(res);
	}

	public async getItems(): Promise<Item[]> {
		const res: { [key: string]: string; } = await this.redis.hgetall(this.key);

		const items = Object.values(res).map(x => this.deserializeItem(x));
		return items.filter((x): x is Item => x !== null);
	}

	public async insertItem(nextItem: Item): Promise<boolean> {
		const id = nextItem.id;

		const prevItem = await this.getItem(id);
		if (prevItem !== null && equals(prevItem, nextItem)) {
			return false;
		}

		const value = this.serializeItem(nextItem);
		await this.redis.hset(this.key, nextItem.id, value);

		return true;
	}

	public async getUntweetedItems(platform: string): Promise<Item[]> {
		const items = await this.getItems();
		return items.filter((x): x is Item => x !== null).filter(x => x.platform === platform).filter(x => x.tweet === 0);
	}
}
