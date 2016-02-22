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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: true
    },
    creatureIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creature',
        autopopulate: false
    }]
  });
BestiarySchema.plugin(autopopulate);

module.exports = mongoose.model('Bestiary',BestiarySchema);
