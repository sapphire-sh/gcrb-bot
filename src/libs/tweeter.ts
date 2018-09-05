import Twit from 'twit';

export class Tweeter {
	private twit: Twit[];

	public initialize(config: any) {
		this.twit = [
			new Twit(config.twitter0),
			new Twit(config.twitter1),
			new Twit(config.twitter2),
			new Twit(config.twitter3),
			new Twit(config.twitter4),
		];
		return Promise.resolve();
	}

	public composeTweet(item) {
		return new Promise((resolve, reject) => {
			const date = item.date;
			const title = item.title;
			let platform;
			switch(item.platform) {
				case -1: platform = ''; break;
				case 0: platform = 'PC/온라인 게임'; break;
				case 1: platform = '비디오 게임'; break;
				case 2: platform = '모바일 게임'; break;
				case 3: platform = '아케이드 게임'; break;
			}
			let rating;
			switch(item.rating) {
				case -1: rating = ''; break;
				case 0: rating = '전체이용가'; break;
				case 1: rating = '12세 이용가'; break;
				case 2: rating = '15세 이용가'; break;
				case 3: rating = '청소년 이용불가'; break;
				case 4: rating = '등급거부'; break;
				case 5: rating = '등급취소예정'; break;
				case 6: rating = '등급취소'; break;
			}
			const applicant = item.applicant;

			let status = `[${date}]\n[${platform}]\n[${title}]\n[${applicant}]\n[${rating}]\n`;

			const excess = status.length - (140 - 23);
			if(excess > 0) {
				const tokens = status.match(/\[.*\]/g);
				tokens[2] = '[' + title.substr(0, title.length - excess - 1) + '…]';
				status = tokens.join('\n');
				status += '\n';
			}
			status += `http://www.grac.or.kr/Statistics/Popup/Pop_ReasonInfo.aspx?${item.id}\n@GameRatingInfo`;

			resolve({
				'status': status,
			});
		});
	}

	public tweetItem(item) {
		return this.composeTweet(item)
		.then((data: any) => {
			return new Promise((resolve, reject) => {
				this.twit[item.platform + 1].post('statuses/update', {
					'status': data.status,
				}, (err, res) => {
					if(err) {
						console.log(err);
						reject(err);
						return;
					}
					resolve();
				});
			});
		})
		.catch((e) => {
			console.log(e);
		});
	}
}
