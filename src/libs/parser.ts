import request from 'request';
import cheerio from 'cheerio';

import {
	Item,
} from '../models';

export class Parser {
	private baseURL = 'http://www.grac.or.kr/Statistics/GameStatistics.aspx';
	private userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';
	private dateRange = 10;
	private platforms = [
		'01',
		'03',
		'04',
		'05',
	];
	private ratings = [
		'rating_all',
		'rating_12',
		'rating_15',
		'rating_18',
		'icon_reject',
		'icon_cancel1',
		'icon_cancel2',
	];

	public getDates() {
		const date = new Date();
		const enddate = date.toISOString().substr(0, 10);
		date.setDate(date.getDate() - this.dateRange);
		const startdate = date.toISOString().substr(0, 10);

		return {
			'startdate': startdate,
			'enddate': enddate,
		};
	}

	public getPlatforms() {
		return this.platforms;
	}

	public getURL(data: any) {
		const params: any = {
			'type': 'search',
			'enddate': data.enddate,
			'startdate': data.startdate,
			'platform': data.platform,
			'pageindex': data.page,
		};

		return `${this.baseURL}?${Object.keys(params).map(e => {
			return `${e}=${params[e]}`;
		}).join('&')}`;
	}

	private async sendRequest(url: string): Promise<string> {
		return await new Promise<string>((resolve, reject) => {
			request({
				'url': url,
				'headers': {
					'User-Agent': this.userAgent,
				},
			}, (err, res, body: string) => {
				console.log(typeof body);
				if (err || res.statusCode !== 200) {
					reject(err);
				}
				resolve(body);
			});
		});
	}

	private parseItem($: any, e: any, platform: number): Item | null {
		try {
			const column = $(e).find('td').toArray();

			const tweet = 0;

			const title = $(column[0]).text().trim();
			const id = $(column[0]).find('a').attr('href').split('\'')[1];
			const applicant = $(column[1]).text().trim();
			const date = $(column[2]).text().trim().replace(/,/g, '-');
			const rating = this.ratings.indexOf($(column[3]).find('img').attr('src').split('/').pop().split('.').shift());
			const code = $(column[4]).text().trim();

			return {
				'id': id,
				'date': date,
				'title': title,
				'platform': platform,
				'applicant': applicant,
				'rating': rating,
				'code': code,
				'tweet': tweet,
			};
		}
		catch (err) {
			/* istanbul ignore next */
			console.log(err);
			/* istanbul ignore next */
			return null;
		}
	}

	public async parsePage(data: any): Promise<Item[]> {
		const url = this.getURL(data);

		console.log(url);

		const body = await this.sendRequest(url);
		const $ = cheerio.load(body);

		const platform = this.platforms.indexOf(data.platform);

		const items: Item[] = [];
		$('table.statistics tr').each((i, e) => {
			if (i === 0) {
				return;
			}

			const item = this.parseItem($, e, platform);
			if (item === null) {
				return;
			}
			items.push(item);
		});
		return items;
	}
}
