var jwt = require("jsonwebtoken");
var config = require("../config");
var User = require('../models/user');
var PersistentSession = require('../models/persistentSession');

var generateNewPersistentSession = function(existingSession,user,res,callback){
  var query = {'username':user.username};
  var deletionCallback = function(err){
    if(err)
      callback(err);
    else{
      var persistentSession = new PersistentSession({'username':user.username});
      persistentSession.save(function (err, doc) {
          if(err)
              callback(err);
          else {
              res.cookie('bestiarymanagertoken',persistentSession.token);
              res.cookie('bestiarymanagerusername',user.username);
              callback(null,doc);
          }
      });
    }
  }

  if(!existingSession)
    PersistentSession.findOneAndRemove(query,function(err){
      deletionCallback(err);
    });
  else
    existingSession.remove(deletionCallback);
}

//takes:
//{
//  username (string)
//  password (string - not hashed)
//  rememberme (boolean)
//}
//alternately instead of password, can accept cookies with persistent session info:
//cookies.bestiarymanagertoken (hashed token set by server, front end doesn't have to touch)
//cookies.bestiarymanagerusername (username identifier set by server, front end doesn't have to touch)
//These cookies will be set after a successful authentication with 'rememberme' set to true.
exports.authenticate = function(req, res){
	var query = {};
	if(req.body.email)
		query.email = req.body.email;
	else if(req.body.username)
		query.username_lower = req.body.username.toLowerCase();
	// find the user
  User.findOne(query, function(err, user) {
    if (err) throw err;

    if (!user) {
    	res.status(400).send("Authentication failed. User not found.");
    }
    else if (user) {
      if(!req.body.password){
        if(!req.cookies.bestiarymanagertoken)
          res.status(400).send("Authentication failed. Password required.");
        else{
          var persistentToken = req.cookies.bestiarymanagertoken;
          PersistentSession.findOne({'username':user.username}, function(err,persistentSession){
            if(err)
              res.status(400).send("Authentication failed.");
            else if(persistentSession){
              persistentSession.compareToken(persistentToken,function(err,isMatch){
                generateNewPersistentSession(persistentSession,user,res,function(err,doc){
                  if(err)
                    res.status(400).send("Authentication failed. Unable to generate persistent session.");
                  else{
                    var token = jwt.sign(user, config.secret, {
                      expiresIn: config.tokens.duration
                    });
                    res.send(token);
                  }
                });
              });
            }
            else
              res.status(400).send("Authentication failed.");
          });
        }
      }
      else{
        // check if password matches
        user.comparePassword(req.body.password,function(err,isMatch){
          if(err)
            res.status(400).send(err);
          else if(isMatch){
            // if user is found and password is right
            // create a token
            var token = jwt.sign(user, config.secret, {
              expiresIn: config.tokens.duration
            });

            if(req.body.rememberme){
              generateNewPersistentSession(null,user,res,function(err,doc){
                if(err)
                  res.status(400).send("Authentication failed. Unable to generate persistent session.");
                else{
                  res.send(token);
                }
              });
            }
            else
              res.send(token);
          }
          else{
            res.status(403).send("Authentication failed. Incorrect password.");
          }
        });
      }
    }
  });
}

exports.revokeAuthentication = function(req, res) {
  res.clearCookie('bestiarymanagertoken');
  res.clearCookie('bestiarymanagerusername');
  res.send();
}

exports.getCurrentUser = function(req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token,config.secret,function(err,decoded){
            if(err)
                res.status(400).send("Failed to authenticate token.");
            else{
                var query = {'_id':decoded._doc._id};
                User.findOne(query, function (err, doc) {
                    if(err)
                        res.status(400).send(err);
                    else if(doc){
                        doc.password = undefined;   //remove password field from returned value
                        res.send(doc);
                    }
                    else
                        res.status(400).send("User not found.");
                })
            }
        });
    }
    else{
        res.status(400).send("No token provided.");
    }
};
