var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');

var BestiarySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
    description: {
      type: String
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: false
    }
  });
BestiarySchema.plugin(autopopulate);

module.exports = mongoose.model('Bestiary',BestiarySchema);
