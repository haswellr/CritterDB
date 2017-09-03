
// Options:
// {
//	name (string): name of the alarm
// 	endpoint (string): url of the server's health endpoint
// 	period (int): time between health checks, in milliseconds
//	maxLatency (int): maximum latency of health check request before timing out and registering a failure
// 	alarmOnTrigger: {
// 		consecutiveFailures (int): number of consecutive failures necessary to fire the alarm
// 		notifications: {
// 			email (boolean): set to true to send an email to the health monitor's recipients
// 		}
// 		action: {
//			command (string): a script to execute on the machine (such as to try restarting the server)
//			interval (int): interval in milliseconds in between running command.
//			attempts (int): number of attempts to make at running command
//		}
// 	}
// 	alarmOffTrigger: {
// 		consecutiveSuccesses (int): number of consecutive successes necessary to turn off the alarm
// 		notifications: {
// 			email (boolean): set to true to send an email to the health monitor's recipients
// 		}
// 		action: {
//			command (string): a script to execute on the machine (such as to try restarting the server)
//			interval (int): interval in milliseconds in between running command.
//			attempts (int): number of attempts to make at running command
//		}
// 	}
// }

// Sample Options:
// {
//	'name': 'Server Running',
// 	'endpoint': 'localhost:3000/api/health',
// 	'period': 30000,
//	'maxLatency': 10000,
// 	'alarmOnTrigger': {
// 		'consecutiveFailures': 3,
// 		'notifications': {
// 			'email': true
// 		},
// 		'action': {
//					'command': '/sbin/stop critterdb && /sbin/start critterdb',
//					'interval': 60000,
//					'attempts': 60
//				}
// 	},
// 	'alarmOffTrigger': {
// 		'consecutiveSuccesses': 3,
// 		'notifications': {
// 			'email': true
// 		}
// 	}
// }

// Expected response from endpoint:
// {
//   alive (boolean): true if the server is alive (although really if the server is not alive we won't even hear anything back)
//   systemsAlive: {
//     SYSTEM_NAME (boolean): various system names can be included here and will be true if they are alive. if any are false, then the health check fails
//   }
// }

var request = require('request');
var nodemailer = require('nodemailer');
var exec = require('child_process').exec;

function Alarm(options, emailOptions){
	this.timer = null;
	this.options = options;
	this.emailOptions = emailOptions;


	this.transporter = nodemailer.createTransport('smtps://' +
    this.emailOptions.sender.address +
    ":" +
    this.emailOptions.sender.password +
    "@smtp.gmail.com");

	this._failures = 0;
	this._successes = 0;
	this._alarmed = false;
	this._statuses = [];
	this._actionTimer = null;
}

Alarm.prototype._sendEmailAlert = function(){
    var mailOptions = {
        from: '"'+this.emailOptions.sender.name+'" <'+this.emailOptions.sender.address+'>',
        to: this.emailOptions.recipients.join(","),
        subject: '[CritterDB Alarm] ' + this.options.name + ", Alarm is on: " + this._alarmed,
        text: 'The status of an alarm has changed.\n\nCurrent Date: ' + new Date().toLocaleString() + '\n\nStatuses:\n' + JSON.stringify(this._statuses)
    };
    this.transporter.sendMail(mailOptions,function(error, info){
        if(error)
            console.log("Error setting up mailer: " + error);
    });
}

Alarm.prototype._runAction = function(action){
	var timesRun = 0;
	this._actionTimer = setInterval((function(){
		exec(action.command);
		timesRun++;
		if(timesRun >= action.attempts){
			clearInterval(this._actionTimer);
		}
	}).bind(this), action.interval);
}

Alarm.prototype._turnAlarmOn = function(){
	this._alarmed = true;
	if(this._actionTimer != null)
		clearInterval(this._actionTimer);
	if(this.options.alarmOnTrigger.action){
		this._runAction(this.options.alarmOnTrigger.action);
	}
	if(this.options.alarmOnTrigger.notifications.email){
		this._sendEmailAlert();
	}
	//clear everything
	this._failures = 0;
	this._successes = 0;
	this._statuses = [];
}

Alarm.prototype._turnAlarmOff = function(){
	this._alarmed = false;
	if(this._actionTimer != null)
		clearInterval(this._actionTimer);
	if(this.options.alarmOffTrigger.action){
		this._runAction(this.options.alarmOffTrigger.action);
	}
	if(this.options.alarmOffTrigger.notifications.email){
		this._sendEmailAlert();
	}
	//clear everything
	this._failures = 0;
	this._successes = 0;
	this._statuses = [];
}

Alarm.prototype._registerSuccess = function(status){
	if(this._alarmed){
		this._successes++;
		this._statuses.push(status);
		if(this._successes >= this.options.alarmOffTrigger.consecutiveSuccesses){
			this._turnAlarmOff();
		}
	}
}

Alarm.prototype._registerFailure = function(status){
	if(!this._alarmed){
		this._failures++;
		this._statuses.push(status);
		if(this._failures >= this.options.alarmOnTrigger.consecutiveFailures){
			this._turnAlarmOn();
		}
	}
}

Alarm.prototype._checkHealth = function(){
	var requestOptions = {
		uri: this.options.endpoint,
		timeout: 5000
	};
	request(requestOptions, (function(error, response, body){
		if(!body){
			body = {};
		} else {
			body = JSON.parse(body);
		}
		if(error || !body.alive || !body.systemsAlive){			
			body.error = error;
			this._registerFailure(body);
		}
		else {
			var healthy = true;
			//if any system has failed, health check fails
			for(var system in body.systemsAlive){
				if (body.systemsAlive.hasOwnProperty(system) && !body.systemsAlive[system]){
					health = false;
				}
			}
			if(healthy)
				this._registerSuccess(body);
			else
				this._registerFailure(body);
		}
	}).bind(this))
}

Alarm.prototype.start = function() {
	if(this.timer == null){
		this.timer = setInterval(this._checkHealth.bind(this), this.options.period);
	}
}

Alarm.prototype.stop = function() {
	if(this.timer != null){
		clearInterval(this.timer);
	}
}

module.exports = Alarm;