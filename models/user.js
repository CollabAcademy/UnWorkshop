var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, index: true },
  date: { type: Date, default: Date.now }
});

UserSchema.statics.findByEmail = function (email, cb) {
  return this.find({ email: email }, cb);
}

var User = mongoose.model('User', UserSchema);

module.exports = {
  User: User
}
