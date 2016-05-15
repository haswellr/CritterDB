var mongoose = require('mongoose');

var FavoriteSchema = new mongoose.Schema(
	{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  });

module.exports = mongoose.model('FavoriteSchema',FavoriteSchema);
