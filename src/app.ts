'use strict';

const config = require('../config.js');

import {
	Database,
	Parser,
	Tweeter,
} from './libs';

export class App {
	public database: Database;
	public parser: Parser;
	public tweeter: Tweeter;

	public async initialize() {
		this.database = new Database();
		this.parser = new Parser();
		this.tweeter = new Tweeter();

		await Promise.all([
			this.database.initialize(config),
			this.parser.initialize(),
			this.tweeter.initialize(config),
		]);
	}
}
