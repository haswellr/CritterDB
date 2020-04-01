
//Get mongoose Creature model
var Creature = require('../models/creature');
var Bestiary = require('../models/bestiary');
var PublishedBestiary = require('../models/publishedBestiary');
var jwt = require("jsonwebtoken");
var config = require("../config");
exports.PAGE_SIZE = 25;

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

var authenticatePublishedBestiaryByOwner = function(req, publishedBestiary, callback){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.secret,function(err,decoded){
            if(err)
                callback("Failed to authenticate token.");
            else{
                var ownerId = publishedBestiary.owner._id || publishedBestiary.owner;
                if(decoded._doc._id != ownerId)
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

var authenticateCreatureByBestiary = function(req, creature, callback){
    if(creature.bestiaryId && creature.publishedBestiaryId){
        setTimeout(function () {
            callback("Creature cannot be in multiple bestiaries.")
        });
    }
    else if(creature.bestiaryId){
        var query = {'_id':creature.bestiaryId};
        Bestiary.findOne(query, function(err, doc){
            if(err)
                callback(err.message);
            else if(doc)
                authenticateBestiaryByOwner(req, doc, callback);
            else
                callback("Bestiary not found.");
        });
    }
    else if(creature.publishedBestiaryId){
        var query = {'_id':creature.publishedBestiaryId};
        PublishedBestiary.findOne(query, function(err, doc){
            if(err)
                callback(err.message);
            else if(doc)
                authenticatePublishedBestiaryByOwner(req, doc, callback);
            else
                callback("Published Bestiary not found.");
        });
    }
    else{
        setTimeout(function() {
            callback("Creature must belong to a bestiary.")
        });
    }
}

var authenticateViewCreatureAccess = function(req, creature, callback) {
    if (creature.sharing && creature.sharing.linkSharingEnabled) {
        setTimeout(function() {
            callback(null)
        });
    } else {
        authenticateCreatureByBestiary(req, creature, callback);
    }
}

exports.findById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    Creature.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.message);
        }
        else if(doc){
            authenticateViewCreatureAccess(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else
                    res.send(doc);
            });
        }
        else{
            res.status(400).send("Creature not found");
        }
    });
};

exports.findAll = function(req, res) {
    Creature.find({}, function(err, docs) {
        if(err){
            res.status(400).send(err.message);
        }
        else{
            res.send(docs);
        }
    });
};

exports.create = function(req, res) {
    var creature = new Creature(req.body);

    authenticateCreatureByBestiary(req, creature, function(err){
        if(err) {
            res.status(400).send(err);
        }
        else{
            creature.save(function (err, doc) {
                if(err) {
                    res.status(400).send(err.message);
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
    var creature = new Creature(req.body);
    var options = {
        upsert: true,       //creates if not found
        new: true           //retrieves new object from database and returns that as doc
    }

    Creature.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.message);
        }
        else if(doc){
            authenticateCreatureByBestiary(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    Creature.findOneAndUpdate(query, creature, options, function(err, doc){
                        if(err){
                            res.status(400).send(err.message);
                        }
                        else if(doc){
                            res.send(doc);
                        }
                    });
                }
            });
        }
        else{
            res.status(400).send("Creature not found");
        }
    });
}

exports.deleteById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    Creature.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.message);
        }
        else if(doc){
            authenticateCreatureByBestiary(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    Creature.findByIdAndRemove(query, function(err, doc, result){
                        if(err){
                            res.status(400).send(err.message);
                        }
                        else{
                            res.send(doc);
                        }
                    });
                }
            });
        }
        else{
            res.status(400).send("Creature not found");
        }
    });
}
