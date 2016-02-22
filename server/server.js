var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.databaseUrl);

var express = require('express');
var path = require('path');

//Controllers
var creatures = require('./controllers/creatures');
var bestiaries = require('./controllers/bestiaries');
var users = require('./controllers/users');
var authentication = require('./controllers/authentication');

var app = express();

//app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(express.json());
app.use(express.urlencoded());
//server public folder
app.use("/assets",express.static(path.join(__dirname,"public")));

//Serve front end
app.get('/',function(req,res){
	res.sendfile(path.join(__dirname+'/views/index.html'));
});
//Creatures
app.get('/api/creatures', creatures.findAll);		//REMOVE THIS
app.get('/api/creatures/:id', creatures.findById);		//complete
app.post('/api/creatures', creatures.create);		//complete
app.put('/api/creatures/:id', creatures.updateById);		//complete
app.delete('/api/creatures/:id', creatures.deleteById);		//complete
//Bestiaries
app.get('/api/bestiaries/:id/creatures', bestiaries.findCreaturesByBestiary);	//complete
app.get('/api/bestiaries', bestiaries.findAll);		//REMOVE THIS
app.get('/api/bestiaries/:id', bestiaries.findById);	//complete
app.post('/api/bestiaries', bestiaries.create);	//complete
app.put('/api/bestiaries/:id', bestiaries.updateById);	//complete
app.delete('/api/bestiaries/:id', bestiaries.deleteById);	//complete
//Users
app.get('/api/users/:id/bestiaries', users.findBestiariesByOwner);	//complete
app.get('/api/users', users.findAll);		//REMOVE THIS
app.get('/api/users/:id', users.findById);		//REMOVE THIS - replace with api/users/:id/public
app.post('/api/users', users.create);	//complete
app.put('/api/users/:id', users.updateById);	//complete
app.delete('/api/users/:id', users.deleteById);	//complete
//Authentication
app.get('/api/authenticate/user', authentication.getCurrentUser);	//complete
app.post('/api/authenticate', authentication.authenticate);	//complete

app.listen(3000);
console.log('Listening on port 3000...');
