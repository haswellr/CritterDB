
var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');

var Alarm = require('./alarm');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

config.alarms.forEach(function(alarmData){
	console.log("starting alarm: '" + alarmData.name + "', endpoint: " + alarmData.endpoint);
	var alarm = new Alarm(alarmData,config.email);
	alarm.start();
});

console.log("monitoring health...");