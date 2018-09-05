import {
	App,
} from './app';

(async () => {
	try {
		const app = new App();

		await app.initialize();

		while(true) {
			const dates = await app.parser.getDates();
			const platforms = await app.parser.getPlatforms();
			await Promise.all(platforms.map(async (platform) => {
				const data = {
					'platform': platform,
					'startdate': dates.startdate,
					'enddate': dates.enddate,
					'page': 0,
				};

				let items = [];
				do {
					items = await app.parser.parsePage(data);
					await app.database.insertItems(items);
					++data.page;
				}
				while(items.length > 0);
			}));

			await Promise.all(platforms.map(async (_, i) => {
				const items = await app.database.getUntweetedItems(i);
				for(const item of items) {
					if(process.env.NODE_ENV === 'test') {
						console.log('test');
					}
					else {
						await app.tweeter.tweetItem(item);
						await app.database.flagTweetedItem(item);
					}
					await new Promise((resolve) => {
						setTimeout(resolve, 5000);
					});
				}
				await new Promise((resolve) => {
					setTimeout(resolve, (process.env.NODE_ENV === 'test' ? 0 : 5 * 60 * 1000));
				});
			}));
		}
	}
	catch(err) {
		console.log(err);
	}
})();
