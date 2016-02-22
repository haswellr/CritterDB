
//Get mongoose model
var Bestiary = require('../models/bestiary');
var Creature = require('../models/creature');
var jwt = require("jsonwebtoken");
var config = require("../config");

var authenticateBestiaryByOwner = function(req, bestiary, callback){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.secret,function(err,decoded){
            if(err)
                callback("Failed to authenticate token.");
            else{
                if(decoded._doc._id != bestiary.ownerId)
                    callback("Not authorized for access.");
                else
                    callback(null);
            }
        });
    }
    else{
        callback("No token provided.");
    }
}

exports.findById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    Bestiary.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            authenticateBestiaryByOwner(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else
                    res.send(doc);
            });
        }
        else{
            res.status(400).send("Bestiary not found.");
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
    var bestiary = new Bestiary(req.body);

    authenticateBestiaryByOwner(req, bestiary, function(err){
        if(err)
            res.status(400).send(err);
        else{
            bestiary.save(function (err, doc) {
                if(err) {
                    res.status(400).send(err);
                }
                else {
                    res.send(doc);
                }
            });
        }
    });
}

exports.updateById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};
    var creature = new Bestiary(req.body);
    var options = {
        upsert: true,       //creates if not found
        new: true           //retrieves new object from database and returns that as doc
    }

    Bestiary.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            authenticateBestiaryByOwner(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    Bestiary.findOneAndUpdate(query, creature, options, function(err, doc){
                        if(err)
                            res.status(400).send(err);
                        else
                            res.send(doc);
                    });
                }
            });
        }
        else{
            res.status(400).send("Bestiary not found.");
        }
    });
}

exports.deleteById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    Bestiary.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            authenticateBestiaryByOwner(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    Bestiary.findByIdAndRemove(query, function(err, doc, result){
                        if(err)
                            res.status(400).send(err);
                        else
                            res.send(doc);
                    });
                }
            });
        }
        else{
            res.status(400).send("Bestiary not found.");
        }
    });
}

exports.findCreaturesByBestiary = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    Bestiary.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            authenticateBestiaryByOwner(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    Creature.find({
                        bestiaryId: doc._id
                    }, function(err, docs){
                        if(err)
                            res.status(400).send(err);
                        else
                            res.send(docs);
                    });
                }
            });
        }
        else{
            res.status(400).send("Bestiary not found");
        }
    });
};
