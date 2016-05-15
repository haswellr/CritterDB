var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema(
	{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
    	type: String,
    	default: ""
    }
  });

module.exports = mongoose.model('CommentSchema',CommentSchema);
