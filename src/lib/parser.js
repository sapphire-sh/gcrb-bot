'use strict';

const _ = require('underscore');
const jsdom = require('jsdom');
const schedule = require('node-schedule');

const PLATFORMS = ['01', '03', '04', '05'];

class Parser {
	constructor(db, tweet) {
		let self = this;
		self.db = db;
		self.tweet = tweet;
	}
	
	parse(platform, page) {
		let date = new Date();
		let currDate = date.toISOString().substr(0, 10);
		date.setDate(date.getDate() - 3);
		let prevDate = date.toISOString().substr(0, 10);
		
		page = (page === undefined ? 0 : page);
		
		const platformId = PLATFORMS.indexOf(platform) + 1;
		const URL = `http://www.grac.or.kr/Statistics/GameStatistics.aspx?type=search&enddate=${currDate}&startdate=${prevDate}&platform=${platform}&pageindex=${page}`;
		
		return new Promise((resolve, reject) => {
			jsdom.env(URL, (err, window) => {
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
						parse(platform, page + 1)
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
}

module.exports = Parser;
