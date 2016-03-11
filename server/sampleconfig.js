//the server folder needs to hold a file called 'config.js' that looks similar to this
module.exports = {
	'secret': "secret-key-for-app",
	'databaseUrl': "url-for-database",
	'tokens': {
		'duration': 86400
	},
	'email': {
		'address': 'email-address-to-send-from',
		'name': 'Critter DB',
		'password': 'email-address-password'
	}
};
