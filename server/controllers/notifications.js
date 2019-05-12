//Get mongoose model
var Notification = require('../models/notification');
var userUtilities = require('./common/userUtilities');
var PAGE_SIZE = 10;

exports.create = function(notification, callback) {
  var notification = new Notification(notification);
  notification.hasBeenRead = false;

  notification.save(function (err, doc) {
    if(err) {
      callback(err.message);
    }
    else {
      callback(null, doc);
    }
  });
}

exports.findAll = function(req, res) {
  var page = req.params.page || 1;
  var sort = {
    _id: -1
  };
  userUtilities.getCurrentUserId(req, function(err,currentUserId){
    if(err)
      res.status(400).send(err);
    else{
      var query = {
        userId: currentUserId
      };
      Notification
        .find(query)
        .sort(sort)
        .skip(PAGE_SIZE * (page-1))
        .limit(PAGE_SIZE)
        .exec(function (err, docs) {
          if(err){
            res.status(400).send(err.message);
          }
          else{
            res.send(docs);
          }
        });
    }
  });
}

exports.deleteById = function(req, res) {
  var id = req.params.id;
  var query = {'_id':id};

  Notification.findOne(query, function (err, notification) {
    if(err)
      res.status(400).send(err.message);
    if(!notification)
      res.status(400).send("Notification not found.");

    userUtilities.getCurrentUserId(req, function(err, currentUserId){
      if(err)
        res.status(400).send(err);
      else if(currentUserId != notification.userId)
        res.status(400).send("Not authorized.");
      else {
        Notification.findByIdAndRemove(query, function(err, doc, result){
          if(err)
            res.status(400).send(err.message);
          else
            res.send(doc);
        });
      }
    });
  });
}

exports.deleteAll = function(req, res) {
  userUtilities.getCurrentUserId(req, function(err, userId){
    if(err)
      res.status(400).send(err);
    if(!userId)
      res.status(400).send("User not found.");

    const notificationsQuery = {
      userId: userId
    }
    const result = await Notification.deleteMany(notificationsQuery);
    if(result.ok != 1) {
      res.status(400).send("Error deleting all notifications for user.");
    }
    res.send();
  });
}