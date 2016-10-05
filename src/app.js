'use strict';

const config = require('../config');

let knex = require('knex')(config.knex);
let twit;
if(process.env.NODE_ENV !== 'test') {
	twit = new (require('twit'))(config.twitter);
}

let request = require('request');
let cheerio = require('cheerio');

const platforms = [ '01', '03', '04', '05' ];
const ratings = [ 'rating_all', 'rating_12', 'rating_15', 'rating_18', 'icon_reject', 'icon_cancel1', 'icon_cancel2' ];
const table_name = 'gcrb_bot';

class App {
	constructor() {
		let self = this;
		
		
		knex.schema.hasTable(table_name).then((exists) => {
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
		}).then(() => {
			if(process.env.NODE_ENV !== "test") {
				Promise.resolve(0).then(function loop(i) {
					console.log(i);
					
					return self.start().then((data) => {
						let promises = platforms.map((platform) => {
							return self.parse(platform, data.startdate, data.enddate, data.page).then(function loop(data) {
								if(data.items.length > 0) {
									return self.insert(data.items).then(() => {
										return self.parse(platform, data.startdate, data.enddate, data.page + 1).then(loop).catch((e) => {
											console.log(e);
										});
									}).catch((e) => {
										console.log(e);
									});
								}
								else {
									return Promise.resolve();
								} 
							});
						});
						return Promise.all(promises).then(() => {
							return self.tweet();
						}).then(() => {
							return new Promise((resolve, reject) => {
								setTimeout(() => {
									resolve(i + 1);
								}, 5 * 60 * 1000);
							});
						}).then(loop).catch((e) => {
							console.log(e);
						});
					}).catch((e) => {
						console.log(e);
					});
				});
			}
		}).catch((e) => {
			console.log(e);
		});
	}
	
	start() {
		let self = this;
		
		return new Promise((resolve, reject) => {
			let date = new Date();
			let enddate = date.toISOString().substr(0, 10);
			date.setDate(date.getDate() - 3);
			let startdate = date.toISOString().substr(0, 10);
			
			resolve({
				startdate: startdate,
				enddate: enddate,
				page: 0
			});
		});
	}
	
	parse(platform, startdate, enddate, page) {
		let self = this;
		
		let data = {
			items: [],
			startdate: startdate,
			enddate: enddate,
			page: page
		};
		
		const url = `http://www.grac.or.kr/Statistics/GameStatistics.aspx?type=search&enddate=${enddate}&startdate=${startdate}&platform=${platform}&pageindex=${page}`;
		
		return new Promise((resolve, reject) => {
			request(url, (err, res, body) => {
				if(!err && res.statusCode === 200) {
					let $ = cheerio.load(body);
					
					let items = [];
					$('table.statistics tr').each((i, e) => {
						if(i > 0) {
							let item = {};
							
							$(e).find('td').each((i, e) => {
								let str = $(e).text().trim();
								
								item.platform = platforms.indexOf(platform);
								item.tweet = 0;
								
								switch(i) {
								case 0:
									item.title = str;
									
									item.id = $(e).find('a').attr('href').split('\'')[1];
									
									break;
								case 1:
									item.applicant = str;
									
									break;
								case 2:
									item.date = str.replace(/,/g, '-');
									
									break;
								case 3:
									let rating = $(e).find('img').attr('src').split('/').pop().split('.').shift();
									
									item.rating = ratings.indexOf(rating);
									
									break;
								case 4:
									item.code = str;
									
									break;
								}
							});
							
							items.push(item);
						}
					});
					
					data.items = items;
					resolve(data);
				}
				else {
					resolve(data);
				}
			});
		});
	}
	
	insert(items) {
		let self = this;
		
		return new Promise((resolve, reject) => {
			let promises = items.map((item) => {
				return knex(table_name).where({
					id: item.id
				}).then((rows) => {
					if(rows.length === 0) {
						return knex(table_name).insert(item);
					}
					else {
						return Promise.resolve();
					}
				}).catch((e) => {
					console.log(e);
				});
			});
			Promise.all(promises).then(() => {
console.log(1);
				resolve();
			}).catch((e) => {
				console.log(e);
			});
		});
	}
	
	tweet() {
		let self = this;
		
		return new Promise((resolve, reject) => {
			knex(table_name).where({
				tweet: 0
			}).then((rows) => {
				let promises = rows.map((row) => {
					return new Promise((resolve, reject) => {
						let date = row.date;
						let title = row.title;
							let platform;
						switch(row.platform) {
						case -1: platform = ''; break;
						case 0: platform = 'PC/온라인 게임'; break;
						case 1: platform = '비디오 게임'; break;
						case 2: platform = '모바일 게임'; break;
						case 3: platform = '아케이드 게임'; break;
						}
						let rating;
						switch(row.rating) {
						case -1: rating = ''; break;
						case 0: rating = '전체이용가'; break;
						case 1: rating = '12세 이용가'; break;
						case 2: rating = '15세 이용가'; break;
						case 3: rating = '청소년 이용불가'; break;
						case 4: rating = '등급거부'; break;
						case 5: rating = '등급취소예정'; break;
						case 6: rating = '등급취소'; break;
						}
						let applicant = row.applicant;
						
						let status = `[${date}]\n[${platform}]\n[${title}]\n[${applicant}]\n[${rating}]\n`;
						
						let excess = status.length - (140 - 23);
						if(excess > 0) {
							var tokens = status.match(/\[.*\]/g);
							tokens[2] = '[' + title.substr(0, title.length - excess - 1) + '…]';
							status = tokens.join('\n');
							status += '\n';
						}
						status += `http://www.grac.or.kr/Statistics/Popup/Pop_ReasonInfo.aspx?${row.id}`;
						
						twit.post('statuses/update', {
							status: status
						}, (err, res) => {
							if(err) {
								throw new Error(err);
							}
							
							knex(table_name).where({
								id: row.id
							}).update({
								tweet: 1
							}).then(() => {
								resolve();
							}).catch((e) => {
								console.log(e);
							});
						});
					});
				});
				Promise.all(promises).then(() => {
					resolve();
				}).catch((e) => {
					console.log(e);
				});
			});
		});
	}
}

if(process.env.NODE_ENV !== "test") {
	let app = new App();
}

module.exports = App;

