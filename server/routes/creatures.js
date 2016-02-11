var mongoose = require('mongoose');
var assert = require('assert');

var databaseUrl = "mongodb://ryan:3Edcft6yhn@ds061335.mongolab.com:61335/bestiarymanager";

mongoose.connect(databaseUrl);

//Define Creature model for Mongoose
var Creature = mongoose.model('Creature', 
    {
        name: {
            type: String,
            required: true
        },
        environment: {
            type: String
        },
        level: {
            type: Number
        }
     });

exports.findById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    Creature.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            res.send(doc);
        }
        else{
            res.status(400).send("Creature not found");
        }
    });
};

exports.findAll = function(req, res) {
    Creature.find({}, function(err, docs) {
        if(err){
            res.status(400).send(err);
        }
        else{
            res.send(docs);
        }
    });
};

exports.create = function(req, res) {
    var creature = new Creature(req.body);

    creature.save(function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else {
            res.send(doc);
        }
    })
}

exports.updateById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};
    var creature = new Creature(req.body);
    var options = {
        upsert: true,       //creates if not found
        new: true           //retrieves new object from database and returns that as doc
    }

    Creature.findOneAndUpdate(query, creature, options, function(err, doc){
        if(err){
            res.status(400).send(err);
        }
        else if(doc){
            res.send(doc);
        }
    });
}

exports.deleteById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    Creature.findByIdAndRemove(query, function(err, doc, result){
        if(err){
            res.status(400).send(err);
        }
        else{
            res.send(doc);
        }
    });
}