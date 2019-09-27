import Twit from 'twit';

export class Tweeter {
	private twit: Twit[] = [];

	public initialize(config: any) {
		this.twit = [
			new Twit(config.twitter0),
			new Twit(config.twitter1),
			new Twit(config.twitter2),
			new Twit(config.twitter3),
			new Twit(config.twitter4),
		];
	}

	private getPlatformString(platform: number): string {
		switch (platform) {
			case 0:
				return 'PC/온라인 게임';
			case 1:
				return '비디오 게임';
			case 2:
				return '모바일 게임';
			case 3:
				return '아케이드 게임';
			case -1:
			default:
				return '';
		}
	}

	private getRatingString(rating: number): string {
		switch (rating) {
			case 0:
				return '전체이용가';
			case 1:
				return '12세 이용가';
			case 2:
				return '15세 이용가';
			case 3:
				return '청소년 이용불가';
			case 4:
				return '등급거부';
			case 5:
				return '등급취소예정';
			case 6:
				return '등급취소';
			case -1:
			default:
				return '';
		}
	}

	public composeTweet(item: any): string {
		const date = item.date;
		const title = item.title;
		const platform = this.getPlatformString(item.platform);
		const rating = this.getRatingString(item.rating);
		const applicant = item.applicant;

		const fragments = [
			`[${date}]`,
			`[${platform}]`,
			`[${title}]`,
			`[${applicant}]`,
			`[${rating}]`,
			`https://www.grac.or.kr/Statistics/Popup/Pop_ReasonInfo.aspx?${item.id}`,
			`@GameRatingInfo`,
		];

		return fragments.join('\n');
	}

	public async tweetItem(item: any): Promise<void> {
		await new Promise((resolve, reject) => {
			this.twit[item.platform + 1].post('statuses/update', {
				'status': this.composeTweet(item),
			}, (err, _) => {
				if (err) {
					console.log(err);
					reject(err);
				}
				resolve();
			});
		});
	}
}
