
//Get mongoose model
var User = require('../models/user');

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
            console.log("err: "+JSON.stringify(err));
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
    var user = new User(req.body);
    var options = {
        upsert: true,       //creates if not found
        new: true           //retrieves new object from database and returns that as doc
    }

    User.findOneAndUpdate(query, user, options, function(err, doc){
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

    User.findByIdAndRemove(query, function(err, doc, result){
        if(err){
            res.status(400).send(err);
        }
        else{
            res.send(doc);
        }
    });
}