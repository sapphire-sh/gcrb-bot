import request from 'request-promise';

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36';

export async function sendRequest(url: string) {
	const body = await request({ url, headers: { 'User-Agent': userAgent } });
	console.log(body);
	return '';
}
