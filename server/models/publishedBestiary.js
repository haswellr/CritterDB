var mongoose = require('mongoose');
var autopopulate = require('mongoose-autopopulate');
var Creature = require('./creature');
var Like = require('./like');
var Favorite = require('./favorite');
var Comment = require('./comment');

var PublishedBestiarySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
    description: {
      type: String
    },
    owner: {  //I wish we could call this 'ownerId' and then autopopulate a field called 'owner' but we can't
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: true
    },
    creatures: [Creature.schema],
    likes: [Like.schema],
    favorites: [Favorite.schema],
    comments: [Comment.schema]
  });
PublishedBestiarySchema.plugin(autopopulate);

module.exports = mongoose.model('PublishedBestiary',PublishedBestiarySchema);
