var mongoose = require('mongoose');
var databaseUrl = "mongodb://ryan:3Edcft6yhn@ds061335.mongolab.com:61335/bestiarymanager";
mongoose.connect(databaseUrl);

var express = require('express');

//Controllers
var creatures = require('./controllers/creatures');
var bestiaries = require('./controllers/bestiaries');

var app = express();

//app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(express.json());
app.use(express.urlencoded());

//Creatures
app.get('/creatures', creatures.findAll);
app.get('/creatures/:id', creatures.findById);
app.post('/creatures', creatures.create);
app.put('/creatures/:id', creatures.updateById);
app.delete('/creatures/:id', creatures.deleteById);
//Bestiaries
app.get('/bestiaries', bestiaries.findAll);
app.get('/bestiaries/:id', bestiaries.findById);
app.post('/bestiaries', bestiaries.create);
app.put('/bestiaries/:id', bestiaries.updateById);
app.delete('/bestiaries/:id', bestiaries.deleteById);

app.listen(3000);
console.log('Listening on port 3000...');