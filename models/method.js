var mongoose = require("mongoose");

var MethodSchema = new mongoose.Schema({
  label: {type: String},
  tool: {type: String},
  description: {type: String},
  user_email: {type: String, index: true},
  rating: {type: Number, default: 0, index: true},
  selected: {type: Boolean, default: false}
});

MethodSchema.statics.get = function(offset, count, cb) {
  return this.find({}, cb).skip(offset).limit(count)
}

MethodSchema.methods.rate = function (rating, cb) {
  return this.model('Method').update({ _id: this._id }, { $inc: { rating: rating}}, cb);
}

MethodSchema.methods.select = function (cb) {
  return this.model('Method').update({ _id: this._id }, {selected: true}, cb);
}

var Method = mongoose.model('Method', MethodSchema);

module.exports = {
  Method: Method
}
