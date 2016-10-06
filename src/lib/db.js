'use strict';

const config = require('../../config');
let knex = require('knex')(config.knex);

const table_name = 'gcrb_bot';

class DB {
  initialize() {
    let self = this;

    return knex.schema.hasTable(table_name).then((exists) => {
			if(exists) {
				return Promise.resolve();
			}
			else {
				return knex.schema.createTableIfNotExists(table_name, (table) => {
					table.string('id').primary().notNullable();
					table.string('date').notNullable();
					table.string('title').notNullable();
					table.integer('platform').notNullable();
					table.string('applicant').notNullable();
					table.integer('rating').notNullable();
					table.string('code');
					table.integer('tweet', 1).notNullable();
					table.timestamp('created_at').defaultTo(knex.fn.now());
				});
			}
		});
  }

  insertItem(item) {
    let self = this;

    return knex(table_name).where({
      id: item.id
    }).then((rows) => {
      if(rows.length === 0) {
        return knex(table_name).insert(item);
      }
      else {
        return Promise.resolve();
      }
    });
  }

  insertItems(items) {
    let self = this;

    let promises = items.map((item) => {
      return self.insertItem(item);
    });
    return Promise.all(promises);
  }

  flagTweetedItem(item) {
    let self = this;

    return knex(table_name).where({
      id: item.id
    }).update({
      tweet: 1
    });
  }

	getUntweetedItems() {
		let self = this;

    return knex(table_name).where({
      tweet: 0
    });
  }
}

module.exports = DB;
