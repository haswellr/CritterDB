var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema(
	{
    author: {  //I wish we could call this 'authorId' and then autopopulate a field called 'author' but we can't
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: {
        select: '_id username'  //only get public fields
      }
    },
    text: {
    	type: String,
    	default: ""
    }
  });

module.exports = mongoose.model('CommentSchema',CommentSchema);
