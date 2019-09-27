import Knex from 'knex';

import {
	Item,
} from '../models';

export class Database {
	private knex: Knex | null = null;
	private tableName = 'gcrb_bot';

	public async initialize(config: any): Promise<void> {
		this.knex = Knex(config.knex);

		const exists = await this.knex.schema.hasTable(this.tableName);
		if (exists) {
			return;
		}

		await this.knex.schema.createTable(this.tableName, table => {
			table.string('id').primary().notNullable();
			table.string('date').notNullable();
			table.string('title').notNullable();
			table.integer('platform').notNullable();
			table.string('applicant').notNullable();
			table.integer('rating').notNullable();
			table.string('code');
			table.integer('tweet').notNullable();
			table.timestamp('created_at').defaultTo(this.knex!.fn.now());
		});
	}

	private async insertItem(item: any): Promise<void> {
		const rows = await this.knex!(this.tableName).where({
			'id': item.id,
		});
		if (rows.length === 0) {
			await this.knex!(this.tableName).insert(item);
		}
	}

	public async insertItems(items: any[]): Promise<void> {
		for (const item of items) {
			await this.insertItem(item);
		}
	}

	public async flagTweetedItem(item: any): Promise<void> {
		await this.knex!(this.tableName).where({
			'id': item.id,
		}).update({
			'tweet': 1,
		});
	}

	public async getUntweetedItems(platform: number): Promise<Item[]> {
		return await this.knex!(this.tableName).where({
			'tweet': 0,
			'platform': platform,
		});
	}
}
