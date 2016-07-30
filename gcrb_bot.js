'use strict';

var jsdom = require('jsdom');
var config = require('./config.js');
var knex = require('knex')(config.knex);
var twit = require('twit');
var tw = new twit(config.twitter);

var table_name = 'gcrb_bot';

var date = new Date();
var currDate = date.toISOString().substr(0, 10);
date.setDate(date.getDate() - 7);
var prevDate = date.toISOString().substr(0, 10);

var data = [];

var platforms = ['01', '03', '04', '05'];
parse(0, 0);

function parse(platformId, page) {
console.log(platformId + ' ' + page);
	var platform = platforms[platformId];
	if(platform === undefined) {
		insert();
	}
	else {
console.log( 'http://www.grac.or.kr/Statistics/GameStatistics.aspx?type=search&enddate=' + currDate + '&startdate=' + prevDate + '&platform=' + platform + '&pageindex=' + page);
		jsdom.env(
			'http://www.grac.or.kr/Statistics/GameStatistics.aspx?type=search&enddate=' + currDate + '&startdate=' + prevDate + '&platform=' + platform + '&pageindex=' + page,
			function (err, window) {
				var rows = Array.from(window.document.querySelectorAll('.mt10 tbody tr'));
				
				rows.reduce(function(prev, curr) {
					return prev.then(function() {
						return new Promise(function(resolve, reject) {
							var cols = Array.from(curr.querySelectorAll('td'));
							if(cols.length === 12) {
								var rating = cols[3].innerHTML.match(/rating_[\w]+/);
								if(rating === null) {
									rating = -1;
								}
								else {
									switch(rating[0].split('_')[1]) {
									case 'all':	rating = 1; break;
									case '12':	rating = 2; break;
									case '15':	rating = 3; break;
									case '18':	rating = 4; break;
									default:	rating = 0;
									}
								}
								data.push({
									gr_aid: cols[0].innerHTML.split('(\'')[1].split('\')')[0],
									gr_date: cols[2].textContent.trim().replace(/,/g, '-'),
									gr_platform: platformId + 1,
									gr_name: cols[0].textContent.trim(),
									gr_applicant: cols[1].textContent.trim(),
									gr_rating: rating,
									gr_code: cols[4].textContent.trim(),
									gr_tweet: rating === -1 ? 2 : 0
								});
							}
							resolve();
						});
					});
				}, Promise.resolve())
				.then(function() {
					if(rows.length == 10) {
						parse(platformId, page + 1);
					}
					else {
						parse(platformId + 1, 0);
					}
					
					window.close();
				});
			}
		);
	}
}

function insert() {
console.log(data);
	data.reduce(function(prev, curr) {
		return prev.then(function() {
			return knex(table_name)
			.where('gr_aid', curr.gr_aid)
			.then(function(rows) {
				if(rows.length === 0) {
					return knex(table_name).insert(curr);
				}
				else {
					return Promise.resolve(true);
				}
			});
		});
	}, Promise.resolve())
	.then(function() {
		knex(table_name)
		.where('gr_tweet', 0)
		.then(function(rows) {
console.log(rows);
			rows.reduce(function(prev, curr) {
				return prev.then(function() {
					tweet(curr);
					return knex(table_name)
					.where('gr_id', curr.gr_id)
					.update('gr_tweet', 1);
				});
			}, Promise.resolve())
			.then(function() {
console.log(1);
				knex.destroy();
			});
		})
		.catch(function(err) {
			console.log(err);
		});
	})
	.catch(function(err) {
		console.log(err);
	});
}

function tweet(data) {
	var date = data.gr_date;
	var name = data.gr_name;
	
	var platform;
	switch(data.gr_platform) {
	case 1:
		platform = 'PC/온라인 게임';
		break;
	case 2:
		platform = '비디오 게임';
		break;
	case 3:
		platform = '모바일 게임';
		break;
	case 4:
		platform = '아케이드 게임';
		break;
	}
	var rating;
	switch(data.gr_rating) {
	case 1:
		rating = '전체이용가';
		break;
	case 2:
		rating = '12세 이용가';
		break;
	case 3:
		rating = '15세 이용가';
		break;
	case 4:
		rating = '청소년 이용불가';
		break;
	}
	var applicant = data.gr_applicant;
	var aid = data.gr_aid;
	
	var status = '[' + date + ']\n' + '[' + platform + ']\n' + '[' + name + ']\n' + '[' + applicant + ']\n';
	if(rating) {
		status += '[' + rating + ']\n';
	}
	
	var excess = status.length - (140 - 23);
	if(excess > 0) {
		name = name.substr(0, name.length - excess - 1);
		name += '…';
		
		status = '[' + date + ']\n' + '[' + platform + ']\n' + '[' + name + ']\n' + '[' + applicant + ']\n';
		if(rating) {
			status += '[' + rating + ']\n';
		}
	}
	status += 'http://www.grac.or.kr/Statistics/Popup/Pop_ReasonInfo.aspx?' + aid;
	
	tw.post('statuses/update', {
		status: status
	}, function(err, res) {
		if(err) {
			console.log(err);
		}
	});
}
