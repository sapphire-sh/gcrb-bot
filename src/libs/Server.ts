import http from 'http';

import Express from 'express';

import {
	Item,
} from '~/models';

import {
	Database,
} from '~/libs';

export class Server {
	public readonly app: Express.Express;
	private readonly server: http.Server;
	private readonly database: Database;

	public constructor() {
		this.database = new Database();

		this.app = Express();

		this.app.use('/api', async (req, res) => {
			const items = await this.getItems();
			res.json(items);
		});

		this.app.use('/', (req, res) => {
			res.json(true);
		});

		this.server = this.app.listen(5101);
	}

	protected async getItems(): Promise<Item[]> {
		return await this.database.getItems();
	}

	public close() {
		this.server.close();
	}
}
