var mongoose = require('mongoose');

var mongooseStatus = {
    0: "(0) Disconnected",
    1: "(1) Connected",
    2: "(2) Connecting",
    3: "(3) Disconnecting"
}
function getMongooseStatus(){
    return mongooseStatus[mongoose.connection.readyState] || "(" + mongoose.connection.readyState + ") Unknown";
}

exports.healthCheck = function(req, res) {
    var health = {
        'alive': true,
        'systemsAlive': {
            'db-alive': mongoose.connection.readyState == 1
        },
        'db-status': getMongooseStatus()
    }
    res.send(health);
}
