'use strict';

let request = require('request');
let cheerio = require('cheerio');

const dateDiff = 10;
const platforms = [ '01', '03', '04', '05' ];
const ratings = [ 'rating_all', 'rating_12', 'rating_15', 'rating_18', 'icon_reject', 'icon_cancel1', 'icon_cancel2' ];

const baseURL = 'http://www.grac.or.kr/Statistics/GameStatistics.aspx';

class Parser {
	initialize() {
		let self = this;

		return Promise.resolve();
	}

	getDates() {
		let self = this;

		return new Promise((resolve, reject) => {
			let date = new Date();
			let enddate = date.toISOString().substr(0, 10);
			date.setDate(date.getDate() - dateDiff);
			let startdate = date.toISOString().substr(0, 10);

			resolve({
				startdate: startdate,
				enddate: enddate
			});
		});
	}

	getPlatforms() {
		let self = this;

		return new Promise((resolve, reject) => {
			resolve(platforms);
		});
	}

	composeURL(data) {
		return `${baseURL}?type=search&enddate=${data.enddate}&startdate=${data.startdate}&platform=${data.platform}&pageindex=${data.page}`;
	}

	parsePage(data) {
		let self = this;

		const url = self.composeURL(data);

		return new Promise((resolve, reject) => {
			request(url, (err, res, body) => {
				let items = [];

				if(!err && res.statusCode === 200) {
					let $ = cheerio.load(body);

					items = $('table.statistics tr').map((i, e) => {
						if(i > 0) {
							let item = {};

							$(e).find('td').each((i, e) => {
								item.platform = platforms.indexOf(data.platform);
								item.tweet = 0;

								switch(i) {
									case 0:
									item.title = $(e).text().trim();
									item.id = $(e).find('a').attr('href').split('\'')[1];

									break;
									case 1:
									item.applicant = $(e).text().trim();

									break;
									case 2:
									item.date = $(e).text().trim().replace(/,/g, '-');

									break;
									case 3:
									let rating = $(e).find('img').attr('src').split('/').pop().split('.').shift();
									item.rating = ratings.indexOf(rating);

									break;
									case 4:
									item.code = $(e).text().trim();

									break;
								}
							});

							return item;
						}
					}).get();
				}

				resolve(items);
			});
		});
	}
}

module.exports = Parser;
