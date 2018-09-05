import request from 'request';
import cheerio from 'cheerio';

const dateDiff = 10;
const platforms = [ '01', '03', '04', '05' ];
const ratings = [ 'rating_all', 'rating_12', 'rating_15', 'rating_18', 'icon_reject', 'icon_cancel1', 'icon_cancel2' ];

const baseURL = 'http://www.grac.or.kr/Statistics/GameStatistics.aspx';

export class Parser {
	public async initialize() {
		return;
	}

	public async getDates() {
		const date = new Date();
		const enddate = date.toISOString().substr(0, 10);
		date.setDate(date.getDate() - dateDiff);
		const startdate = date.toISOString().substr(0, 10);

		return {
			'startdate': startdate,
			'enddate': enddate,
		};
	}

	public async getPlatforms() {
		return platforms;
	}

	public composeURL(data) {
		return `${baseURL}?type=search&enddate=${data.enddate}&startdate=${data.startdate}&platform=${data.platform}&pageindex=${data.page}`;
	}

	public parsePage(data): Promise<any[]> {
		const url = this.composeURL(data);

		console.log(url);

		return new Promise((resolve, reject) => {
			request({
				'url': url,
				'headers': {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
				},
			}, (err, res, body) => {
				let items = [];

				if(!err && res.statusCode === 200) {
					const $ = cheerio.load(body);

					items = $('table.statistics tr').map((i, e) => {
						if(i > 0) {
							const item: any = {};

							$(e).find('td').each((j, f) => {
								item.platform = platforms.indexOf(data.platform);
								item.tweet = 0;

								switch(j) {
									case 0:
									item.title = $(f).text().trim();
									item.id = $(f).find('a').attr('href').split('\'')[1];

									break;
									case 1:
									item.applicant = $(f).text().trim();

									break;
									case 2:
									item.date = $(f).text().trim().replace(/,/g, '-');

									break;
									case 3:
									const rating = $(f).find('img').attr('src').split('/').pop().split('.').shift();
									item.rating = ratings.indexOf(rating);

									break;
									case 4:
									item.code = $(f).text().trim();

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
