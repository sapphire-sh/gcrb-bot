'use strict';

import Knex from 'knex';

const table_name = 'gcrb_bot';

export class Database {
	private knex: Knex;

	public initialize(config: any) {
		this.knex = Knex(config.knex);

		return this.knex.schema.hasTable(table_name).then((exists) => {
			if(exists) {
				return Promise.resolve();
			}
			else {
				return this.knex.schema.createTableIfNotExists(table_name, (table) => {
					table.string('id').primary().notNullable();
					table.string('date').notNullable();
					table.string('title').notNullable();
					table.integer('platform').notNullable();
					table.string('applicant').notNullable();
					table.integer('rating').notNullable();
					table.string('code');
					table.integer('tweet').notNullable();
					table.timestamp('created_at').defaultTo(this.knex.fn.now());
				});
			}
		});
	}

	public insertItem(item) {
		return this.knex(table_name).where({
			'id': item.id,
		}).then((rows) => {
			if(rows.length === 0) {
				return this.knex(table_name).insert(item);
			}
			else {
				return Promise.resolve();
			}
		});
	}

	public insertItems(items) {
		const promises = items.map((item) => {
			return this.insertItem(item);
		});
		return Promise.all(promises);
	}

	public flagTweetedItem(item) {
		return this.knex(table_name).where({
			'id': item.id,
		}).update({
			'tweet': 1,
		});
	}

	public getUntweetedItems(platform: number) {
		return this.knex(table_name).where({
			'tweet': 0,
			'platform': platform,
		});
	}
}
