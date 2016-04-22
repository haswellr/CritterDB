var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.databaseUrl);

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

//Controllers
var creatures = require('./controllers/creatures');
var downloads = require('./controllers/downloads');
var bestiaries = require('./controllers/bestiaries');
var users = require('./controllers/users');
var authentication = require('./controllers/authentication');

var app = express();

//app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
//server public folder
app.use("/assets",express.static(path.join(__dirname,"dist")));

//Serve front end
app.get('/',function(req,res){
	res.sendfile(path.join(__dirname+'/views/index.html'));
});
//Creatures
app.get('/api/creatures/:id', creatures.findById);
app.post('/api/creatures', creatures.create);
app.put('/api/creatures/:id', creatures.updateById);
app.delete('/api/creatures/:id', creatures.deleteById);
//Bestiaries
app.get('/api/bestiaries/:id/creatures', bestiaries.findCreaturesByBestiary);
app.get('/api/bestiaries/:id', bestiaries.findById);
app.post('/api/bestiaries', bestiaries.create);
app.put('/api/bestiaries/:id', bestiaries.updateById);
app.delete('/api/bestiaries/:id', bestiaries.deleteById);
//Users
app.get('/api/users/:id/bestiaries', users.findBestiariesByOwner);
app.get('/api/users/:id/public', users.findPublicInfoById);
app.get('/api/users/search', users.findPublicInfo);
app.post('/api/users', users.create);
app.put('/api/users/:id', users.updateById);
app.delete('/api/users/:id', users.deleteById);
app.post('/api/users/resetpassword', users.resetPassword);
//Authentication
app.get('/api/authenticate/user', authentication.getCurrentUser);
app.post('/api/authenticate', authentication.authenticate);
app.post('/api/revokeauthentication', authentication.revokeAuthentication);
//Downloads
app.post('/api/downloads', downloads.downloadData);

app.listen(3000);
console.log('Listening on port 3000...');
