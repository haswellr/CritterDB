var mongoose = require('mongoose');

var LikeSchema = new mongoose.Schema(
	{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });

module.exports = mongoose.model('LikeSchema',LikeSchema);
