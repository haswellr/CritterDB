
//Get mongoose model
var PublishedBestiary = require('../models/publishedBestiary');
var Comment = require('../models/comment');
var Creature = require('../models/creature');
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

var populateOptions = [
    {
        path: 'owner',
        select: '_id username'
    },
    {
        path: 'comments',
        populate: {
            path: 'author',
            select: '_id username'
        }
    }
];

//Trims a bestiary so that the returned document only includes key details
function getTrimmedBestiary(bestiary){
    var trimmed = {
        _id: bestiary._id,
        name: bestiary.name,
        description: bestiary.description,
        owner: bestiary.owner,
        numLikes: bestiary.likes.length,
        numFavorites: bestiary.favorites.length,
        numComments: bestiary.comments.length
    };
    if(bestiary.creatures)
        trimmed.numCreatures = bestiary.creatures.length;
    return(trimmed);
}

function getTrimmedBestiaryList(bestiaryList){
    var trimmedList = [];
    for(var i=0;i<bestiaryList.length;i++)
        trimmedList.push(getTrimmedBestiary(bestiaryList[i]));
    return(trimmedList);
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
                            //Delete all creatures as well
                            var deleteQuery = {
                                publishedBestiaryId: id
                            };
                            Creature.remove(deleteQuery).exec();
                            //Don't wait on creature deletion to return
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
    var projection = {
        'creatures': false  //we don't need creatures, don't get them
    };
    PublishedBestiary.find({},{'creatures':false}).
        sort(sort).
        skip(PAGE_SIZE * (page-1)).
        limit(PAGE_SIZE).
        exec(function (err, docs) {
            if(err){
                res.status(400).send(err.errmsg);
            }
            else{
                var trimmedBestiaries = getTrimmedBestiaryList(docs); //trim docs of creatures, comments, etc to improve speeds
                res.send(trimmedBestiaries);
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
                var trimmedBestiaries = getTrimmedBestiaryList(docs); //trim docs of creatures, comments, etc to improve speeds
                res.send(trimmedBestiaries);
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
                        var trimmedBestiaries = getTrimmedBestiaryList(docs); //trim docs of creatures, comments, etc to improve speeds
                        res.send(trimmedBestiaries);
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
                        var trimmedBestiaries = getTrimmedBestiaryList(docs); //trim docs of creatures, comments, etc to improve speeds
                        res.send(trimmedBestiaries);
                    }
                });
        }
    });
}

exports.findByOwner = function(req, res) {
    var page = req.params.page || 1;
    var sort = {
        _id: -1
    };
    var query = {
        owner: req.params.id
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
                var trimmedBestiaries = getTrimmedBestiaryList(docs); //trim docs of creatures, comments, etc to improve speeds
                res.send(trimmedBestiaries);
            }
        });
}

exports.createComment = function(req, res) {
    var bestiaryId = req.params.id;
    var query = {'_id':bestiaryId};
    var options = {
        new: true           //retrieves new object from database and returns that as doc
    }
    var comment = new Comment(req.body);

    getCurrentUserId(req, function(err,currentUserId){
        if(err)
            res.status(400).send(err);
        else if(currentUserId != comment.author)
            res.status(400).send("Not authorized for that action.");
        else{
            var update = {
                $addToSet: { 
                    comments: comment
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

exports.updateCommentById = function(req, res) {
    var bestiaryId = req.params.id;
    var commentId = req.params.commentId;
    var options = {
        new: true           //retrieves new object from database and returns that as doc
    }

    getCurrentUserId(req, function(err,currentUserId){
        if(err)
            res.status(400).send(err);
        else{
            var query = {
                _id: bestiaryId,
                comments: {
                    $elemMatch: {
                        author: currentUserId,      //make sure the author is editing it, not someone else
                        _id: commentId
                    }
                }
            };
            var update = {
                $set: {
                    'comments.$.text': req.body.text    //update only mutable fields
                }
            };
            PublishedBestiary.findOneAndUpdate(query, update, options)
                .populate(populateOptions)
                .exec(function (err, doc) {
                    if(err)
                        res.status(400).send(err.errmsg);
                    else if(doc){
                        res.send(doc);
                    }
                    else {
                        res.status(400).send("Document not found");
                    }
                });
        }
    });
}

exports.deleteCommentById = function(req, res) {
    var bestiaryId = req.params.id;
    var commentId = req.params.commentId;
    var query = {'_id':bestiaryId};
    var options = {
        new: true           //retrieves new object from database and returns that as doc
    }

    getCurrentUserId(req, function(err,currentUserId){
        if(err)
            res.status(400).send(err);
        else{
            var update = {
                $pull: {
                    comments: {
                        author: currentUserId,      //make sure the author is deleting it, not someone else
                        _id: commentId
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

exports.search = function(req, res) {
    var page = req.params.page || 1;
    var sort = {
        _id: -1
    };
    var query = {
    };
    if(req.body.name){
        query.name = {
            $regex: new RegExp(req.body.name,"i")
        };
    }
    if(req.body.author){
        query.author = req.body.author;
    }
    console.log("query: "+JSON.stringify(query));
    PublishedBestiary.find(query).
        sort(sort).
        skip(PAGE_SIZE * (page-1)).
        limit(PAGE_SIZE).
        exec(function (err, docs) {
            if(err){
                res.status(400).send(err.errmsg);
            }
            else{
                var trimmedBestiaries = getTrimmedBestiaryList(docs); //trim docs of creatures, comments, etc to improve speeds
                res.send(trimmedBestiaries);
            }
        });
}

exports.findMostPopular = function(req, res) {
    var age = req.query.age || 2628000000;   //max age in milliseconds. default is 1 week.
    var page = Math.min(req.params.page || 1, MAX_PAGE);
    var sort = {
        popularity: -1
    };
    //Build mongo ObjectID to represent minimum object ID allowed, as ObjectId's beginning bytes are a timestamp
    var oldestDate = new Date(new Date().getTime() - age);
    var timestamp = Math.floor(oldestDate.getTime() / 1000);
    var hex = timestamp.toString(16) + "0000000000000000";
    var objIdMin = new mongodb.ObjectId(hex);
    var query = {
        _id: {
            $gt: objIdMin
        }
    };
    PublishedBestiary.find(query).
        sort(sort).
        limit(1).
        exec(function (err, docs) {
            if(err){
                res.status(400).send(err.errmsg);
            }
            else{
                if(docs.length>0)
                    res.send(docs[0]);
                else
                    res.send("");
            }
        });
}

exports.findCreaturesByBestiary = function(req, res) {
    var id = req.params.id;
    var query = {
        'publishedBestiaryId':id
    };
    Creature.find(query, function(err, docs){
        if(err)
            res.status(400).send(err.errmsg);
        else
            res.send(docs);
    });
};
