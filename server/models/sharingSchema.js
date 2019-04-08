var mongoose = require('mongoose');

// settings indicating how this object is shared with others
var SharingSchema = new mongoose.Schema(
    {
        linkSharingEnabled: {
            type: Boolean,
            default: false
        }
    },
    {
        _id : false
    });

module.exports = SharingSchema;