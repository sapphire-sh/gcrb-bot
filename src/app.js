'use strict';

const config = require('../config');

let schedule = require('node-schedule');
let knex = require('knex')(config.knex);
let twit = new (require('twit'))(config.twitter);

let _ = require('lodash');
let request = require('request');
let cheerio = require('cheerio');

const TABLE_NAME = 'gcrb_bot';

class App {
	constructor() {
		let self = this;
		
		self.platforms = [ '01', '03', '04', '05' ];
		
		knex.schema.hasTable(TABLE_NAME)
		.then((exists) => {
			if(exists) {
				return Promise.resolve();
			}
			else {
				return knex.schema.createTableIfNotExists(TABLE_NAME, (table) => {
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
			if(process.env.NODE_ENV !== "test") {
				self.start();
				schedule.scheduleJob('*/5 * * * *', self.start);
			}
		});
	}
	
	start() {
		let self = this;
		
		let promises = [];
		self.platforms.forEach((platform) => {
			promises.push(self.parse(platform, 0));
		});
		Promise.all(promises).then((values) => {
			let games = _.flatten(values);
			games = _.sortBy(games, (game) => {
				return game.date + game.platform;
			});
			
			self.insert(games);
		});
	}
	
	parse(platform, page) {
		let self = this;
		
		let date = new Date();
		let currDate = date.toISOString().substr(0, 10);
		date.setDate(date.getDate() - 3);
		let prevDate = date.toISOString().substr(0, 10);
		
		page = (page === undefined ? 0 : page);
		
		const platformId = self.platforms.indexOf(platform) + 1;
		const url = `http://www.grac.or.kr/Statistics/GameStatistics.aspx?type=search&enddate=${currDate}&startdate=${prevDate}&platform=${platform}&pageindex=${page}`;
		
		return new Promise((resolve, reject) => {
			request(url, (err, res, body) => {
				try {
					if(!err && res.statusCode === 200) {
						let $ = cheerio.load(body);
						
						
			jsdom.env(url, (err, window) => {
					const rows = Array.from(window.document.querySelectorAll('.mt10 tbody tr'));
					
					let data = [];
					_.each(rows, (row) => {
						const cols = Array.from(row.querySelectorAll('td'));
						if(cols.length === 12) {
							let rating = cols[3].innerHTML.match(/rating_[\w]+/);
							if(rating === null) {
								rating = -1;
							}
							else {
								switch(rating[0].split('_')[1]) {
								case 'all':	rating = 1; break;
								case '12':	rating = 2; break;
								case '15':	rating = 3; break;
								case '18':	rating = 4; break;
								default:	rating = 0;
								}
							}
							
							data.push({
								aid: cols[0].innerHTML.split('(\'')[1].split('\')')[0],
								date: cols[2].textContent.trim().replace(/,/g, '-'),
								platform: platformId,
								name: cols[0].textContent.trim(),
								applicant: cols[1].textContent.trim(),
								rating: rating,
								code: cols[4].textContent.trim(),
								tweet: rating === -1 ? 2 : 0
							});
						}
					});
					
					window.close();
					
					if(rows.length === 10) {
						self.parse(platform, page + 1)
						.then((rows) => {
							data = _.union(rows, data);
							resolve(data);
						});
					}
					else {
						resolve(data);
					}
				}
			);
		});
	}
	
	insert(data) {
		let self = this;
		
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
				rows.reduce((prev, curr) => {
					return prev.then(() => {
						self.tweet(curr);
						return knex(TABLE_NAME)
						.where('id', curr.id)
						.update('tweet', 1);
					});
				}, Promise.resolve())
				.then(() => {});
			})
			.catch((err) => {
				console.log(err);
			});
		})
		.catch((err) => {
			console.log(err);
		});
	}
	
	tweet(data) {
		let date = data.date;
		let name = data.name;
		let platform;
		switch(data.platform) {
			case 1: platform = 'PC/온라인 게임'; break;
			case 2: platform = '비디오 게임'; break;
			case 3: platform = '모바일 게임'; break;
			case 4: platform = '아케이드 게임'; break;
		}
		let rating;
		switch(data.rating) {
			case 1: rating = '전체이용가'; break;
			case 2: rating = '12세 이용가'; break;
			case 3: rating = '15세 이용가'; break;
			case 4: rating = '청소년 이용불가'; break;
		}
		let applicant = data.applicant;
		let aid = data.aid;
		
		let status = `[${date}]\n[${platform}]\n[${name}]\n[${applicant}]\n`;
		if(rating) {
			status += `[${rating}]\n`;
		}
		let excess = status.length - (140 - 23);
		if(excess > 0) {
			var tokens = status.match(/\[.*\]/g);
			tokens[2] = '[' + name.substr(0, name.length - excess - 1) + '…]';
			status = tokens.join('\n');
			status += '\n';
		}
		status += `http://www.grac.or.kr/Statistics/Popup/Pop_ReasonInfo.aspx?${aid}`;
		
		twit.post('statuses/update', {
			status: status
		}, (err, res) => {
			if(err) {
				console.log(err);
			}
		});
	}
}

if(process.env.NODE_ENV !== "test") {
	let app = new App();
}

module.exports = App;

