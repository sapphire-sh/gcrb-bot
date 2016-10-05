module.exports = {
	twitter: {
		consumer_key: '',
		consumer_secret: '',
		access_token: '',
		access_token_secret: ''
	},
	knex: {
		client: 'sqlite3',
		connection: {
			filename: './gcrb_bot.sqlite'
		},
		useNullAsDefault: true
	}
};
