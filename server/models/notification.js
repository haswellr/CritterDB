var mongoose = require('mongoose');

var NotificationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["publishedBestiary"],
			required: true
		},
		targetId: {
			type: String,
			required: true
		},
		htmlDescription: {
			type: String,
			required: true
		},
		hasBeenRead: {
        type: Boolean,
        default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });

module.exports = mongoose.model('Notification',NotificationSchema);
