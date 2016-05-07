var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');
var Creature = require('./creature');

var PublishedBestiarySchema = new mongoose.Schema(
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
      autopopulate: true
    },
    creatures: [Creature.schema]
  });
PublishedBestiarySchema.plugin(autopopulate);

module.exports = mongoose.model('PublishedBestiary',PublishedBestiarySchema);
