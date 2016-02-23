
//Get mongoose model
var User = require('../models/user');
var Bestiary = require('../models/bestiary');
var jwt = require("jsonwebtoken");
var config = require("../config");

var authenticateUser = function(req, user, callback){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.secret,function(err,decoded){
            if(err)
                callback("Failed to authenticate token.");
            else{
                if(decoded._doc._id != user._id)
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

var getPublicInfo = function(user){
    var publicInfo = {
        username: user.username,
        _id: user._id
    };
    return(publicInfo);
}

exports.findById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    User.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            res.send(doc);
        }
        else{
            res.status(400).send("User not found");
        }
    });
};

exports.findAll = function(req, res) {
    User.find({}, function(err, docs) {
        if(err){
            res.status(400).send(err);
        }
        else{
            res.send(docs);
        }
    });
};

exports.create = function(req, res) {
    var user = new User(req.body);

    user.save(function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else {
            res.send(getPublicInfo(doc));
        }
    })
}

exports.updateById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};
    var user = new User(req.body);
    var options = {
        new: true           //retrieves new object from database and returns that as doc
    }

    User.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            authenticateUser(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    //set fields that are mutable
                    doc.email = user.email;
                    doc.password = user.password;
                    doc.save(function(err, doc) {
                        if(err){
                            res.status(400).send(err);
                        }
                        else if(doc){
                            res.send(doc);
                        }
                    });
                }
            });
        }
        else{
            res.status(400).send("User not found");
        }
    });
}

exports.deleteById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    User.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            authenticateUser(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    User.findByIdAndRemove(query, function(err, doc, result){
                        if(err)
                            res.status(400).send(err);
                        else
                            res.send(doc);
                    });
                }
            });
        }
        else{
            res.status(400).send("User not found");
        }
    });
}

exports.findBestiariesByOwner = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    User.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            authenticateUser(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                	Bestiary.find({
                		ownerId: doc._id
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
            res.status(400).send("User not found");
        }
    });
};

exports.findPublicInfoById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    User.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err);
        }
        else if(doc){
            res.send(getPublicInfo(doc));
        }
        else{
            res.status(400).send("User not found");
        }
    });
};