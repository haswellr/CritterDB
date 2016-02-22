
//Get mongoose model
var Bestiary = require('../models/bestiary');
var jwt = require("jsonwebtoken");
var config = require("../config");

exports.authenticateByOwner = function(req, res, next) {
    var id = req.params.id;
    var query = {'_id':id};

    Bestiary.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
            if(token){
                jwt.verify(token,config.secret,function(err,decoded){
                    if(err)
                        res.status(400).send("Failed to authenticate token.");
                    else{
                        if(decoded._doc._id != doc.owner._id)
                            res.status(400).send("Not authorized for access.");
                        else
                            next();
                    }
                });
            }
            else{
                res.status(403).send("No token provided.");
            }
        }
        else{
            res.status(400).send("Bestiary not found");
        }
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    Bestiary.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            res.send(doc);
        }
        else{
            res.status(400).send("Bestiary not found");
        }
    });
};

exports.findAll = function(req, res) {
    Bestiary.find({}, function(err, docs) {
        if(err){
            res.status(400).send(err);
        }
        else{
            res.send(docs);
        }
    });
};

exports.create = function(req, res) {
    var creature = new Bestiary(req.body);

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
    var creature = new Bestiary(req.body);
    var options = {
        upsert: true,       //creates if not found
        new: true           //retrieves new object from database and returns that as doc
    }

    Bestiary.findOneAndUpdate(query, creature, options, function(err, doc){
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

    Bestiary.findByIdAndRemove(query, function(err, doc, result){
        if(err){
            res.status(400).send(err);
        }
        else{
            res.send(doc);
        }
    });
}
