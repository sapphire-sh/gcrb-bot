'use strict';

var App = require('../src/app');
var app = new App();

describe('@gcrb_bot', function() {
	it('parse', function(done) {
		this.timeout(20000);
		app.parse('2016-09-28', '2016-09-28', '05', 0).then(() => {
			done();
		});
	});
	
	it('insert', function(done) {
		app.insert([]).then(() => {
			done();
		});
	});
});

