var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');

var BestiarySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
    creatureIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Creature',
        autopopulate: false
    }]
  });
BestiarySchema.plugin(autopopulate);

module.exports = mongoose.model('Bestiary',BestiarySchema);
