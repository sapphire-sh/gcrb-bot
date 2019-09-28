import {
	DATE_RANGE,
	PLATFORMS,
} from '~/constants';

import {
	Database,
	Parser,
	Tweeter,
} from '~/libs';

import {
	getDateString,
	getURL,
	sendRequest,
} from '~/helpers';

export class App {
	public database: Database | null = null;
	public parser: Parser | null = null;
	public tweeter: Tweeter | null = null;
	private shouldProcess: boolean = false;

	public async initialize() {
		this.database = new Database();
		this.parser = new Parser();
		this.tweeter = new Tweeter();

		this.tweeter.initialize(__config);

		this.shouldProcess = true;
	}

	private async parse(platform: string, startdate: string, enddate: string): Promise<void> {
		let page = 0;
		let items = [];
		do {
			const url = getURL({ type: 'search', pageindex: page, enddate, startdate, platform });
			const body = await sendRequest(url);
			items = await this.parser!.parsePage(body, platform);
			const promises = items.map(x => this.database!.insertItem(x));
			await Promise.all(promises);
			++page;
		}
		while (items.length > 0);
	}

	private async tweet(platform: string) {
		const items = await this.database!.getUntweetedItems(platform);
		for (const item of items) {
			if (__test === false) {
				await new Promise(resolve => {
					setTimeout(resolve, 5000);
				});
				await this.tweeter!.tweetItem(item);
			}
			item.tweet = 1;
			await this.database!.insertItem(item);
		}
		await new Promise(resolve => {
			setTimeout(resolve, (__test ? 0 : 5 * 60 * 1000));
		});
	}

	public async start() {
		while (this.shouldProcess) {
			const date = new Date();
			const startdate = getDateString(date, -DATE_RANGE);
			const enddate = getDateString(date);

			for (const platform of PLATFORMS) {
				await this.parse(platform, startdate, enddate);
				await this.tweet(platform);
			}
		}
	}

	public stop() {
		this.shouldProcess = false;
	}
}
