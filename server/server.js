var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.databaseUrl);

var express = require('express');
var path = require('path');

//Controllers
var creatures = require('./controllers/creatures');
var bestiaries = require('./controllers/bestiaries');
var users = require('./controllers/users');

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
app.get('/api/creatures', creatures.findAll);
app.get('/api/creatures/:id', creatures.findById);
app.post('/api/creatures', creatures.create);
app.put('/api/creatures/:id', creatures.updateById);
app.delete('/api/creatures/:id', creatures.deleteById);
//Bestiaries
app.get('/api/bestiaries', bestiaries.findAll);
app.get('/api/bestiaries/:id', bestiaries.findById);
app.post('/api/bestiaries', bestiaries.create);
app.put('/api/bestiaries/:id', bestiaries.updateById);
app.delete('/api/bestiaries/:id', bestiaries.deleteById);
//Users
app.get('/api/users', users.findAll);
app.get('/api/users/:id', users.findById);
app.post('/api/users', users.create);
app.put('/api/users/:id', users.updateById);
app.delete('/api/users/:id', users.deleteById);

app.listen(3000);
console.log('Listening on port 3000...');