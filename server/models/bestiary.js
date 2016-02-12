var mongoose = require('mongoose');

var BestiarySchema = new mongoose.Schema(
	{
        creatures: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Creature'
        }]
    });

module.exports = mongoose.model('Bestiary',BestiarySchema);