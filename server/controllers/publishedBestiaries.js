
//Get mongoose model
var PublishedBestiary = require('../models/publishedBestiary');
var jwt = require("jsonwebtoken");
var config = require("../config");
var users = require("../controllers/users");
var mongodb = require("mongodb");
var PAGE_SIZE = 10;
var MAX_PAGE = 20;

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

var getCurrentUserId = function(req, callback){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.secret,function(err,decoded){
            if(err)
                callback("Failed to authenticate token.");
            else{
                callback(null,decoded._doc._id);
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
    var populateOptions = {
        path: 'owner',
        select: '_id username'
    };
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
                    doc.populate(populateOptions, function(err) {
                        if(err)
                            res.status(400).send(err.errmsg);
                        else{
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

var generateLikeForUserId = function(userId){
    var like = {
        'userId': userId
    };
    return(like);
}

//Creates a like for the current user, if one does not already exist in the list of likes
exports.createLike = function(req, res) {
    var bestiaryId = req.params.id;
    var query = {'_id':bestiaryId};
    var options = {
        new: true           //retrieves new object from database and returns that as doc
    }
    var populateOptions = {
        path: 'owner',
        select: '_id username'
    };

    getCurrentUserId(req, function(err,currentUserId){
        if(err)
            res.status(400).send(err);
        else{
            var like = generateLikeForUserId(currentUserId);
            var update = {
                $addToSet: { 
                    likes: like
                },
                $inc: {
                    popularity: 1
                }
            };
            PublishedBestiary.findOneAndUpdate(query, update, options)
                .populate(populateOptions)
                .exec(function (err, doc) {
                    if(err)
                        res.status(400).send(err.errmsg);
                    else{
                        res.send(doc);
                    }
                });
        }
    });
}

//Deletes a like for the current user, if one exists
exports.deleteLike = function(req, res) {
    var bestiaryId = req.params.id;
    var query = {'_id':bestiaryId};
    var options = {
        new: true           //retrieves new object from database and returns that as doc
    }
    var populateOptions = {
        path: 'owner',
        select: '_id username'
    };

    getCurrentUserId(req, function(err,currentUserId){
        if(err)
            res.status(400).send(err);
        else{
            var update = {
                $pull: {
                    likes: {
                        userId: currentUserId
                    }
                },
                $inc: {
                    popularity: -1
                }
            };
            PublishedBestiary.findOneAndUpdate(query, update, options)
                .populate(populateOptions)
                .exec(function (err, doc) {
                    if(err)
                        res.status(400).send(err.errmsg);
                    else{
                        res.send(doc);
                    }
                });
        }
    });
}

var generateFavoriteForUserId = function(userId){
    var favorite = {
        'userId': userId
    };
    return(favorite);
}

//Creates a favorite for the current user, if one does not already exist in the list of favorites
exports.createFavorite = function(req, res) {
    var bestiaryId = req.params.id;
    var query = {'_id':bestiaryId};
    var options = {
        new: true           //retrieves new object from database and returns that as doc
    }
    var populateOptions = {
        path: 'owner',
        select: '_id username'
    };

    getCurrentUserId(req, function(err,currentUserId){
        if(err)
            res.status(400).send(err);
        else{
            var favorite = generateFavoriteForUserId(currentUserId);
            var update = {
                $addToSet: { 
                    favorites: favorite
                }
            };
            PublishedBestiary.findOneAndUpdate(query, update, options)
                .populate(populateOptions)
                .exec(function (err, doc) {
                    if(err)
                        res.status(400).send(err.errmsg);
                    else{
                        res.send(doc);
                    }
                });
        }
    });
}

//Deletes a favorite for the current user, if one exists
exports.deleteFavorite = function(req, res) {
    var bestiaryId = req.params.id;
    var query = {'_id':bestiaryId};
    var options = {
        new: true           //retrieves new object from database and returns that as doc
    }
    var populateOptions = {
        path: 'owner',
        select: '_id username'
    };

    getCurrentUserId(req, function(err,currentUserId){
        if(err)
            res.status(400).send(err);
        else{
            var update = {
                $pull: {
                    favorites: {
                        userId: currentUserId
                    }
                }
            };
            PublishedBestiary.findOneAndUpdate(query, update, options)
                .populate(populateOptions)
                .exec(function (err, doc) {
                    if(err)
                        res.status(400).send(err.errmsg);
                    else{
                        res.send(doc);
                    }
                });
        }
    });
}

exports.findRecent = function(req, res) {
    var page = Math.min(req.params.page || 1, MAX_PAGE);
    var sort = {
        _id: -1
    };
    PublishedBestiary.find().
        sort(sort).
        skip(PAGE_SIZE * (page-1)).
        limit(PAGE_SIZE).
        exec(function (err, docs) {
            if(err){
                res.status(400).send(err.errmsg);
            }
            else{
                res.send(docs);
            }
        });
}

exports.findPopular = function(req, res) {
    var page = Math.min(req.params.page || 1, MAX_PAGE);
    var sort = {
        popularity: -1
    };
    PublishedBestiary.find().
        sort(sort).
        skip(PAGE_SIZE * (page-1)).
        limit(PAGE_SIZE).
        exec(function (err, docs) {
            if(err){
                res.status(400).send(err.errmsg);
            }
            else{
                res.send(docs);
            }
        });
}

exports.findFavorites = function(req, res) {
    var page = req.params.page || 1;
    var sort = {
        _id: -1
    };
    getCurrentUserId(req, function(err,currentUserId){
        if(err)
            res.status(400).send(err);
        else{
            var query = {
                favorites: {
                    $elemMatch: {
                        userId: currentUserId
                    }
                }
            };
            PublishedBestiary.find(query).
                sort(sort).
                skip(PAGE_SIZE * (page-1)).
                limit(PAGE_SIZE).
                exec(function (err, docs) {
                    if(err){
                        res.status(400).send(err.errmsg);
                    }
                    else{
                        res.send(docs);
                    }
                });
        }
    });
}

exports.findOwned = function(req, res) {
    var page = req.params.page || 1;
    var sort = {
        _id: -1
    };
    getCurrentUserId(req, function(err,currentUserId){
        if(err)
            res.status(400).send(err);
        else{
            var query = {
                owner: currentUserId
            };
            PublishedBestiary.find(query).
                sort(sort).
                skip(PAGE_SIZE * (page-1)).
                limit(PAGE_SIZE).
                exec(function (err, docs) {
                    if(err){
                        res.status(400).send(err.errmsg);
                    }
                    else{
                        res.send(docs);
                    }
                });
        }
    });
}