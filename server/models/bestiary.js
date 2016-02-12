var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');

var BestiarySchema = new mongoose.Schema(
	{
        creatures: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Creature',
            autopopulate: true
        }]
    });
BestiarySchema.plugin(autopopulate);

module.exports = mongoose.model('Bestiary',BestiarySchema);