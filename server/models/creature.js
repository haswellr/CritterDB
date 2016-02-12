var mongoose = require('mongoose');

var CreatureSchema = new mongoose.Schema(
	{
        name: {
            type: String,
            required: true
        },
        environment: {
            type: String
        },
        level: {
            type: Number
        }
    });

module.exports = mongoose.model('Creature',CreatureSchema);