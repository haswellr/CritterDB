var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');
var User = require('./user');

var NotificationSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			required: true
		},
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: false,
      index: true
    },
    notifierUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      autopopulate: true
    },
    type: {
      type: String,
      enum: ["comment","like","mention"],
      required: true
    },
    read: {
      type: Boolean,
      default: false
    }
  });
NotificationSchema.plugin(autopopulate);

module.exports = mongoose.model('Notification',NotificationSchema);
