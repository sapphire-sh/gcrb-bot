import schedule from 'node-schedule';

import {
	DATE_RANGE,
	PlatformType,
} from '~/constants';

import {
	Item,
} from '~/models';

import {
	Database,
	Parser,
	Tweeter,
	Server,
} from '~/libs';

import {
	getDateString,
	getURL,
	sendRequest,
	sleep,
} from '~/helpers';

export class App {
	public readonly database: Database;
	public readonly parser: Parser;
	public readonly server: Server;
	public readonly tweeter: Tweeter;

	public constructor() {
		this.database = new Database();
		this.parser = new Parser();
		this.server = new Server();
		this.tweeter = new Tweeter(__config.twitter);
	}

	private async parse(platform: PlatformType, startdate: string, enddate: string): Promise<void> {
		let page = 0;
		let items: Item[] = [];
		do {
			const url = getURL({ type: 'search', pageindex: page, enddate, startdate, platform });
			const body = await sendRequest(url);
			items = await this.parser.parsePage(body, platform);
			const promises = items.map(x => this.database.insertItem(x));
			await Promise.all(promises);
			++page;
		}
		while (items.length > 0);
	}

	private async tweet(platform: string): Promise<void> {
		const items = await this.database.getUntweetedItems(platform);
		for (const item of items) {
			if (__test === false) {
				await sleep(5000);
				await this.tweeter.tweetItem(item);
			}
			item.tweet = 1;
			await this.database.insertItem(item);
		}
	}

	public async start() {
		schedule.scheduleJob('*/5 * * * *', async () => {
			const date = new Date();
			console.log('parse', date);

			const startdate = getDateString(date, -DATE_RANGE);
			const enddate = getDateString(date);

			for (const platform of Object.values(PlatformType)) {
				await this.parse(platform, startdate, enddate);
			}

			for (const platform of Object.values(PlatformType)) {
				await this.tweet(platform);
			}
		});
	}
}
