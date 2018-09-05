module.exports = {
	twitter: {
		consumer_key: 'consumer_key',
		consumer_secret: 'consumer_secret',
		access_token: 'access_token',
		access_token_secret: 'access_token_secret',
	},
	knex: {
		client: 'sqlite3',
		connection: {
			filename: './gcrb_bot.sqlite',
		},
		useNullAsDefault: true,
	},
};
