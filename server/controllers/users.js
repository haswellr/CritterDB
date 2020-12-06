
//Get mongoose model
var User = require('../models/user');
var Bestiary = require('../models/bestiary');
var Creature = require('../models/creature');
var jwt = require("jsonwebtoken");
var config = require("../config");
var nodemailer = require('nodemailer');
var url = require('url');
var creatures = require("../controllers/creatures");

var transporter = nodemailer.createTransport('smtps://' +
    config.email.address +
    ":" +
    config.email.password +
    "@smtp.gmail.com");

var sendWelcomeEmail = function(email){
    var mailOptions = {
        from: '"'+config.email.name+'" <'+config.email.address+'>',
        to: email,
        subject: 'Welcome to Critter DB',
        text: 'Thanks for joining Critter DB! I hope it helps you with all your critter management needs. Please send any feedback to me at haswellrd@gmail.com or on Github at https://github.com/haswellr/CritterDB.\n\nThanks,\nRyan'
    };
    transporter.sendMail(mailOptions,function(error, info){
        if(error)
            console.log(error);
    });
}

var sendPassword = function(email,passwordUrl){
    var mailOptions = {
        from: '"'+config.email.name+'" <'+config.email.address+'>',
        to: email,
        subject: 'Lost Password',
        text: 'You lost something! Follow this link to set your new password: ' + passwordUrl
    };
    transporter.sendMail(mailOptions,function(error, info){
        if(error)
            console.log(error);
    });
}

var getRandomPassword = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

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
    var publicInfo = {};
    if(user){
        if(user._id)
            publicInfo._id = user._id;
        if(user.username)
            publicInfo.username = user.username;
    }
    return(publicInfo);
}
exports.getPublicInfo = getPublicInfo;

exports.findById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    User.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.message);
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
            res.status(400).send(err.message);
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
            res.status(400).send(err.message);
        }
        else {
            res.send(getPublicInfo(doc));
            sendWelcomeEmail(doc.email);
        }
    })
}

//POST accepting:
//email
//password
//currentPassword (required)
exports.updateById = function(req, res) {
    var id = req.params.id;
    var query = {'_id':id};

    User.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.message);
        }
        else if(doc){
            doc.comparePassword(req.body.currentPassword,function(err,isMatch){
              if(err)
                res.status(400).send(err);
              else if(isMatch){
                //set fields that are mutable
                if(req.body.email)
                    doc.email = req.body.email;
                if(req.body.password)
                    doc.password = req.body.password;
                doc.save(function(err, doc) {
                    if(err){
                        res.status(400).send(err);
                    }
                    else if(doc){
                        res.send(getPublicInfo(doc));
                    }
                });
              }
              else{
                res.status(403).send("Invalid password.");
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
            res.status(400).send(err.message);
        }
        else if(doc){
            authenticateUser(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    User.findByIdAndRemove(query, function(err, doc, result){
                        if(err)
                            res.status(400).send(err.message);
                        else
                            res.send(getPublicInfo(doc));
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
            res.status(400).send(err.message);
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

exports.searchCreatures = function(req, res) {
    var id = req.params.id;
    var page = req.params.page;
    var query = {'_id':id};
    var sort = {
        _id: -1
    };
    User.findOne(query, function (err, doc) {
        if(err) {
            res.status(400).send(err.message);
        }
        else if(doc){
            authenticateUser(req, doc, function(err){
                if(err)
                    res.status(400).send(err);
                else{
                    Bestiary.find({
                        ownerId: doc._id
                    }, function(err, bestiaries){
                        if(err)
                            res.status(400).send(err);
                        else {
                            const userBestiaryIds = bestiaries.map(function(bestiary) { return bestiary._id; });
                            const creaturesQuery = Object.assign({},req.query);
                            if(creaturesQuery.name) {
                                creaturesQuery.name = {
                                    $regex: new RegExp(creaturesQuery.name, "i")
                                };
                            }
                            // Creature must match the provided query AND either be in a public bestiary or
                            // be in one of this user's bestiaries.
                            const searchQuery = {
                                $and: [
                                    creaturesQuery,
                                    {
                                        $or: [
                                            {
                                                publishedBestiaryId: {
                                                    $exists: true,
                                                    $ne: null
                                                }
                                            },
                                            {
                                                bestiaryId: {
                                                    $in: userBestiaryIds
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                            Creature.find(searchQuery)
                                .sort(sort)
                                .skip(creatures.PAGE_SIZE * (page-1))
                                .limit(creatures.PAGE_SIZE)
                                .exec(function(err, creatures){
                                    if(err)
                                        res.status(400).send(err.message);
                                    else{
                                        res.send(creatures);
                                    }
                                });
                        }
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
            res.status(400).send(err.message);
        }
        else if(doc){
            res.send(getPublicInfo(doc));
        }
        else{
            res.status(400).send("User not found");
        }
    });
};

exports.findPublicInfo = function(req, res) {
    var username = req.body.username || req.query.username;
    var email = req.body.email || req.query.email;
    var id = req.body._id || req.query._id;
    var query = {};
    if(username || email || id){
        if(username)
            query.username_lower = username.toLowerCase();
        if(email)
            query.email = email;
        if(id)
            query._id = id;
        User.findOne(query, function (err, doc) {
            if(err) {
                res.status(400).send(err.message);
            }
            else if(doc){
                res.send(getPublicInfo(doc));
            }
            else{
                res.status(400).send("User not found.");
            }
        });
    }
    else{
        res.status(400).send("Invalid query.");
    }
};

exports.resetPassword = function(req, res) {
    var username = req.body.username || req.query.username;
    var email = req.body.email || req.query.email;
    if(username || email){
        var query = {};
        if(username)
            query.username_lower = username.toLowerCase();
        if(email)
            query.email = email;
        User.findOne(query, function (err, doc) {
            if(err) {
                res.status(400).send(err.message);
            }
            else if(doc){
                var newPassword = getRandomPassword();
                doc.password = newPassword;
                doc.save(function(err, doc) {
                    if(err){
                        res.status(400).send(err);
                    }
                    else if(doc){
                        var url = req.headers.origin+'/#/account/newpassword?id='+doc._id+'&password='+newPassword;
                        sendPassword(doc.email,url);
                        res.send();
                    }
                });
            }
            else{
                res.status(400).send("User not found.");
            }
        });
    }
    else{
        res.status(400).send("Invalid query.");
    }
};
