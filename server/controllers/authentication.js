var jwt = require("jsonwebtoken");
var config = require("../config");
var User = require('../models/user');

exports.authenticate = function(req, res){
	var query = {};
	if(req.body.email)
		query.email = req.body.email;
	else if(req.body.username)
		query.username = req.body.username;
	// find the user
  User.findOne(query, function(err, user) {

    if (err) throw err;

    if (!user) {
    	res.status(400).send("Authentication failed. User not found.");
    }
    else if (user) {
      if(!req.body.password)
        res.status(400).send("Authentication failed. Password required.");
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

            // return the information including token as JSON
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
