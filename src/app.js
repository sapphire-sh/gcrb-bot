'use strict';

let DB = require('./lib/db');
let Parser = require('./lib/parser');
let Tweet = require('./lib/tweet');

class App {
	initialize() {
		let self = this;

		self.db = new DB();
		self.parser = new Parser();
		self.tweet = new Tweet();

		let promises = [];
		promises.push(self.db.initialize());
		promises.push(self.parser.initialize());
		promises.push(self.tweet.initialize());
		return Promise.all(promises)
		.then(() => {
			return new Promise((resolve, reject) => {
				resolve(0);
			});
		});
	}

	start() {
		return app.initialize()
		.then(function loop(i) {
			console.log(i);

			return app.parser.getDates()
			.then((dates) => {
				return app.parser.getPlatforms()
				.then((platforms) => {
					let promises = platforms.map((platform) => {
						let data = {
							platform: platform,
							startdate: dates.startdate,
							enddate: dates.enddate,
							page: 0
						};

						return app.parser.parsePage(data)
						.then(function loop(items) {
							return app.db.insertItems(items)
							.then(() => {
								if(items.length > 0) {
									++data.page;
									return app.parser.parsePage(data)
									.then(loop);
								}
								else {
									return Promise.resolve();
								}
							})
							.catch((e) => {
								console.log(e);
							});
						})
						.catch((e) => {
							console.log(e);
						});
					});
					return Promise.all(promises);
				})
				.then(() => {
					return app.db.getUntweetedItems();
				})
				.then((items) => {
					let promises = items.map((item) => {
						if(process.env.NODE_ENV === 'test') {
							return Promise.resolve();
						}
						else {
							return app.tweet.tweetItem(item)
							.then(() => {
								return app.db.flagTweetedItem(item);
							})
							.catch((e) => {
								console.log(e);
							});
						}
					});
					return Promise.all(promises);
				})
				.then(() => {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							resolve(i + 1);
						}, (process.env.NODE_ENV === 'test' ? 0 : 5 * 60 * 1000));
					});
				})
				.then((i) => {
					if(process.env.NODE_ENV == 'test') {
						return Promise.resolve(i);
					}
					else {
						return loop(i);
					}
				})
				.catch((e) => {
					console.log(e);
				});
			})
			.catch((e) => {
				console.log(e);
			});
		})
		.catch((e) => {
			console.log(e);
		});
	}
}

let app = new App();
app.start().then(() => {});

module.exports = App;
