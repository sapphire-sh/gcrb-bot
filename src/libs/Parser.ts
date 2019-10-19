import cheerio from 'cheerio';

import {
	PlatformType,
	RATINGS,
} from '~/constants';

import {
	Item,
} from '~/models';

export class Parser {
	public parseItem($: CheerioStatic, e: CheerioElement, platform: PlatformType): Item | null {
		try {
			const column = $(e).find('td').toArray();

			const id = $(column[0]).find('a').attr('href').split('\'')[1];
			const date = $(column[2]).text().trim().replace(/,/g, '-');
			const title = $(column[0]).text().trim();
			const applicant = $(column[1]).text().trim();
			const rating = RATINGS.indexOf($(column[3]).find('img').attr('src').split('/').pop()!.split('.').shift()!);
			const code = $(column[4]).text().trim();
			const tweet = 0;

			return { id, date, title, applicant, rating, platform, code, tweet };
		}
		catch (error) {
			console.log(error);
			return null;
		}
	}

	public async parsePage(body: string, platform: PlatformType): Promise<Item[]> {
		const $ = cheerio.load(body);

		const items: Item[] = [];
		$('table.statistics tr').each((i, e) => {
			if (i === 0) { return; }

			const item = this.parseItem($, e, platform);
			if (item === null) { return; }

			items.push(item);
		});
		return items;
	}
}
