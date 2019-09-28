import {
	getURL,
	sendRequest,
} from '~/helpers';

import {
	Parser,
} from '~/libs';

describe('libs/Parser', () => {
	test('parsePage', async () => {
		const parser = new Parser();

		const startdate = '2016-09-27';
		const enddate = '2016-09-29';
		const platform = '03';
		const page = 0;

		const url = getURL({
			type: 'search',
			pageindex: page,
			enddate,
			startdate,
			platform,
		});
		const body = await sendRequest(url);
		const items = await parser.parsePage(body, platform);

		expect(items).toHaveLength(1);
		expect(items[0].title).toBe('PS4_Kitchen(키친)');
	});
});
