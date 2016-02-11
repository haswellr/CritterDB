var express = require('express');
var creatures = require('./routes/creatures');

var app = express();

//app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
app.use(express.json());
app.use(express.urlencoded());

app.get('/creatures', creatures.findAll);
app.get('/creatures/:id', creatures.findById);
app.post('/creatures', creatures.create);
app.put('/creatures/:id', creatures.updateById);
app.delete('/creatures/:id', creatures.deleteById);

app.listen(3000);
console.log('Listening on port 3000...');