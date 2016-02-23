var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcryptjs'),
    randomstring = require('randomstring'),
    SALT_WORK_FACTOR = 10;

var PersistentSessionSchema = new Schema({
    username: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    token: {
      type: String
    }
});


PersistentSessionSchema.pre('save', function(next) {
    var persistentSession = this;
    var randomToken = randomstring.generate();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(randomToken, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            persistentSession.token = hash;
            next();
        });
    });
});

PersistentSessionSchema.methods.compareToken = function(candidateToken, cb) {
    bcrypt.compare(candidateToken, this.token, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('PersistentSession', PersistentSessionSchema);
