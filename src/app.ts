'use strict';

import {
	Database,
	Parser,
	Tweeter,
} from './libs';

export class App {
	public database: Database | null = null;
	public parser: Parser | null = null;
	public tweeter: Tweeter | null = null;
	private shouldProcess: boolean = false;

	public async initialize() {
		this.database = new Database();
		this.parser = new Parser();
		this.tweeter = new Tweeter();

		await this.database.initialize(__config);
		this.tweeter.initialize(__config);

		this.shouldProcess = true;
	}

	private async parse(platform: string, startdate: string, enddate: string): Promise<void> {
		const data = {
			'platform': platform,
			'startdate': startdate,
			'enddate': enddate,
			'page': 0,
		};

		let items = [];
		do {
			items = await this.parser!.parsePage(data);
			await this.database!.insertItems(items);
			++data.page;
		}
		while (items.length > 0);
	}

	private async tweet(platform: number) {
		const items = await this.database!.getUntweetedItems(platform);
		for (const item of items) {
			if (__test === false) {
				await new Promise(resolve => {
					setTimeout(resolve, 5000);
				});
				await this.tweeter!.tweetItem(item);
			}
			await this.database!.flagTweetedItem(item);
		}
		await new Promise(resolve => {
			setTimeout(resolve, (__test ? 0 : 5 * 60 * 1000));
		});
	}

	public async start() {
		while (this.shouldProcess) {
			const {
				startdate,
				enddate,
			} = await this.parser!.getDates();
			const platforms = await this.parser!.getPlatforms();

			await Promise.all(platforms.map(e => {
				return this.parse(e, startdate, enddate);
			}));

			await Promise.all(platforms.map((_, i) => {
				return this.tweet(i);
			}));
		}
	}

	public stop() {
		this.shouldProcess = false;
	}
}
