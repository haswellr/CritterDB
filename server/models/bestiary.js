var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');
var SharingSchema = require('./sharingSchema');

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
    },
    lastActive: {
      type: Date
    },
    sharing: {
        type: SharingSchema,
        default: {}
    }
  });
BestiarySchema.plugin(autopopulate);

module.exports = mongoose.model('Bestiary',BestiarySchema);
