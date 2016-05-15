
//Get mongoose model
var PublishedBestiary = require('../models/publishedBestiary');
var jwt = require("jsonwebtoken");
var config = require("../config");
var users =require("../controllers/users");

var authenticateBestiaryByOwner = function(req, bestiary, callback){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.secret,function(err,decoded){
            if(err)
                callback("Failed to authenticate token.");
            else{
                var bestiaryOwnerId = bestiary.owner._id || bestiary.owner;
                if(decoded._doc._id != bestiaryOwnerId)
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

    PublishedBestiary.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.errmsg);
        }
        else if(doc){
            //Do not authenticate by owner because this is public
            //Hide sensitive data for owner (this really should probably be done somewhere else)
            doc.owner = users.getPublicInfo(doc.owner);
            res.send(doc);
        }
        else{
            res.status(400).send("Bestiary not found.");
        }
    });
};

exports.findAll = function(req, res) {
    PublishedBestiary.find({}, function(err, docs) {
        if(err){
            res.status(400).send(err.errmsg);
        }
        else{
            res.send(docs);
        }
    });
};

exports.create = function(req, res) {
    //Handle the case where user sends an owner object instead of an owner id, since the field name
    //'owner' can be confusing.
    if(req.body && req.body.owner && req.body.owner._id)
        req.body.owner = req.body.owner._id;
    var publishedBestiary = new PublishedBestiary(req.body);
    authenticateBestiaryByOwner(req, publishedBestiary, function(err){
        if(err)
            res.status(400).send(err);
        else{
            publishedBestiary.save(function (err, doc) {
                if(err) {
                    res.status(400).send(err.errmsg);
                }
                else {
                    doc.populate('owner', function(err) {
                        if(err)
                            res.status(400).send(err.errmsg);
                        else{
                            //Hide sensitive data for owner (this really should probably be done somewhere else)
                            doc.owner = users.getPublicInfo(doc.owner);
                            res.send(doc);
                        }
                    });
                }
            });
        }
    });
}

//POST accepting:
//name
//description
// - The other fields are not mutable and cannot be changed by updating this data object.
exports.updateById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    PublishedBestiary.findOne(query, function (err, existingDoc) {
        if(err) {
            res.status(400).send(err.errmsg);
        }
        else if(existingDoc){
            authenticateBestiaryByOwner(req, existingDoc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    //Set fields that are mutable
                    if(req.body.name)
                        existingDoc.name = req.body.name;
                    if(req.body.description)
                        existingDoc.description = req.body.description;
                    existingDoc.save(function(err, doc) {
                        if(err)
                            res.status(400).send(err.errmsg);
                        else{
                            //Hide sensitive data for owner (this really should probably be done somewhere else)
                            existingDoc.owner = users.getPublicInfo(existingDoc.owner);
                            res.send(existingDoc);
                        }
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

    PublishedBestiary.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.errmsg);
        }
        else if(doc){
            authenticateBestiaryByOwner(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    PublishedBestiary.findByIdAndRemove(query, function(err, doc, result){
                        if(err)
                            res.status(400).send(err.errmsg);
                        else{
                            //Hide sensitive data for owner (this really should probably be done somewhere else)
                            doc.owner = users.getPublicInfo(doc.owner);
                            res.send(doc);
                        }
                    });
                }
            });
        }
        else{
            res.status(400).send("Bestiary not found.");
        }
    });
}
