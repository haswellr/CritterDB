
module.exports = {
	'port': 3050,
	'alarms': [
		{
			'name': 'Server Running',
			'endpoint': 'http://localhost:3000/api/health',
			'period': 3000,
			'maxLatency': 10000,
			'alarmOnTrigger': {
				'consecutiveFailures': 3,
				'notifications': {
					'email': true
				},
				'action': {
					'command': '/sbin/restart critterdb',
					'interval': 600,
					'attempts': 6
				}
			},
			'alarmOffTrigger': {
				'consecutiveSuccesses': 3,
				'notifications': {
					'email': true
				}
			}
		}
	],
	'email': {
		'sender': {
			'address': 'email-address@host.com',
			'name': 'Sender Name',
			'password': 'email-password'
		},
		'recipients': [
			'recipient@host.com'
		]
	}
};
