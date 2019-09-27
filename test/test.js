// 'use strict';

// var assert = require('assert');
// var should = require('should');

// var App = require('../src/app');
// var app = new App();

describe('', () => {
	test('', () => { });
})

// describe('@gcrb_bot', function() {
// 	it('initialize app', function(done) {
// 		app.initialize()
// 		.then(() => {
// 			done();
// 		});
// 	});

// 	describe('parser', function() {
// 		it('get dates', function() {
// 			return app.parser.getDates().should.eventually.have.keys('startdate', 'enddate');
// 		});

// 		it('get platforms', function() {
// 			return app.parser.getPlatforms().should.eventually.have.length(4);
// 		});

// 		it('compose url', function() {
// 			app.parser.composeURL({
// 				startdate: '2016-09-27',
// 				enddate: '2016-09-29',
// 				platform: '03',
// 				page: 0
// 			}).should.be.equal('http://www.grac.or.kr/Statistics/GameStatistics.aspx?type=search&enddate=2016-09-29&startdate=2016-09-27&platform=03&pageindex=0');
// 		});

// 		it('parse page', function() {
// 			this.timeout(50000);
// 			return app.parser.parsePage({
// 				startdate: '2016-09-27',
// 				enddate: '2016-09-29',
// 				platform: '03',
// 				page: 0
// 			})
// 			.then((items) => {
// 				items.should.have.length(1);
// 				items[0].should.have.keys('id', 'title');
// 				items[0].title.should.be.equal('PS4_Kitchen(키친)');
// 			});
// 		});
// 	});

// 	describe('db', function() {
// 		it('second initialization', function() {
// 			this.timeout(50000);
// 			return app.db.initialize();
// 		});

// 		it('insert items', function() {
// 			this.timeout(50000);
// 			return app.parser.parsePage({
// 				startdate: '2016-09-27',
// 				enddate: '2016-09-29',
// 				platform: '03',
// 				page: 0
// 			})
// 			.then((items) => {
// 				return app.db.insertItems(items);
// 			});
// 		});

// 		it('insert duplicate items', function() {
// 			this.timeout(50000);
// 			return app.parser.parsePage({
// 				startdate: '2016-09-27',
// 				enddate: '2016-09-29',
// 				platform: '03',
// 				page: 0
// 			})
// 			.then((items) => {
// 				return app.db.insertItems(items);
// 			});
// 		});

// 		it('get untweeted items', function() {
// 			return app.db.getUntweetedItems();
// 		});

// 		it('flag tweeted items', function() {
// 			return app.db.getUntweetedItems()
// 			.then((items) => {
// 				let promises = items.map((item) => {
// 					return app.db.flagTweetedItem(item);
// 				});
// 				return Promise.all(promises);
// 			});
// 		})
// 	});

// 	describe('tweet', function() {
// 		it('compose tweet', function() {
// 			this.timeout(50000);
// 			return app.parser.parsePage({
// 				startdate: '2016-09-27',
// 				enddate: '2016-09-29',
// 				platform: '03',
// 				page: 0
// 			})
// 			.then((items) => {
// 				return app.tweet.composeTweet(items[0]);
// 			})
// 			.then((data) => {
// 				data.status.should.be.equal('[2016-09-28]\n[비디오 게임]\n[PS4_Kitchen(키친)]\n[캡콤엔터테인먼트코리아]\n[청소년 이용불가]\nhttp://www.grac.or.kr/Statistics/Popup/Pop_ReasonInfo.aspx?2b0265a8f0dc02c97e754b2ea22c1f63cecd98f227eaeaf17ed258610ac557e8');
// 			});
// 		});
// 	});
// });
