var jwt = require("jsonwebtoken");
var config = require("../../config");

exports.getCurrentUserId = function(req, callback){
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