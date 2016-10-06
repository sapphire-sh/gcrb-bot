'use strict';

const config = require('../../config');
let twit = new (require('twit'))(config.twitter);

class Tweet {
	initialize() {
		let self = this;

		return Promise.resolve();
	}

	composeTweet(item) {
		let self = this;

		return new Promise((resolve, reject) => {
			let date = item.date;
			let title = item.title;
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
			let applicant = item.applicant;

			let status = `[${date}]\n[${platform}]\n[${title}]\n[${applicant}]\n[${rating}]\n`;

			let excess = status.length - (140 - 23);
			if(excess > 0) {
				var tokens = status.match(/\[.*\]/g);
				tokens[2] = '[' + title.substr(0, title.length - excess - 1) + '…]';
				status = tokens.join('\n');
				status += '\n';
			}
			status += `http://www.grac.or.kr/Statistics/Popup/Pop_ReasonInfo.aspx?${item.id}`;

			resolve({
				status: status
			});
		});
	}

	tweetItem(item) {
		let self = this;

		return self.composeTweet(item)
		.then((data) => {
			return new Promise((resolve, reject) => {
				twit.post('statuses/update', {
					status: data.status
				}, (err, res) => {
					if(err) {
						throw new Error(err);
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

module.exports = Tweet;
