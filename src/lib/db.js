'use strict';
		
const TABLE_NAME = 'gcrb_bot';

class DB {
	construct(knex, twit) {
		let self = this;
		self.knex = knex;
		self.tweet = tweet;
		
		self.knex.schema.hasTable(TABLE_NAME)
		.then((exists) => {
			if(exists) {
				return Promise.resolve();
			}
			else {
				return self.knex.schema.createTableIfNotExists(TABLE_NAME, (table) => {
					table.increments();
					table.string('aid').notNullable();
					table.string('date').notNullable();
					table.integer('platform').notNullable();
					table.string('name').notNullable();
					table.string('applicant').notNullable();
					table.integer('rating').notNullable();
					table.string('code').notNullable();
					table.integer('tweet', 1).notNullable();
					table.timestamp('created_at').defaultTo(knex.fn.now());
				});
			}
		})
		.then(() => {
			start();
			schedule.scheduleJob('*/5 * * * *', start);
		});
	}
	
	insert(data) {
		function insert(data) {
			data.reduce((prev, curr) => {
				return prev.then(() => {
					return knex(TABLE_NAME)
					.where('aid', curr.aid)
					.then((rows) => {
						if(rows.length === 0) {
							return knex(TABLE_NAME).insert(curr);
						}
						else {
							return Promise.resolve();
						}
					});
				});
			}, Promise.resolve())
			.then(() => {
				knex(TABLE_NAME)
				.where('tweet', 0)
				.then((rows) => {
		console.log(rows);
					console.log(rows.length);
					rows.reduce((prev, curr) => {
						return prev.then(() => {
		//					tweet(curr);
		console.log(curr);
							return knex(TABLE_NAME)
							.where('id', curr.id)
							.update('tweet', 1);
						});
					}, Promise.resolve())
					.then((e) => {
						console.log(e);
					})
				})
				.catch((err) => {
					console.log(err);
				});
			})
			.catch((err) => {
				console.log(err);
			});
		}
	}
}

module.exports = DB;
