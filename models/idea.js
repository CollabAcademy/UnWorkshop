var mongoose = require("mongoose");

var IdeaSchema = new mongoose.Schema({
  title: {type: String},
  blurb: {type: String},
  success_metrics: {type: String},
  user_email: {type: String, index: true},
  rating: {type: Number, default: 0, index: true},
  selected: {type: Boolean, default: false}
});

IdeaSchema.methods.rate = function (rating, cb) {
  return this.model('Idea').update({ _id: this._id }, { $inc: { rating: rating}}, cb);
}

IdeaSchema.methods.select = function (cb) {
  return this.model('Idea').update({ _id: this._id }, {selected: true}, cb);
}

var Idea = mongoose.model('Idea', IdeaSchema);

module.exports = {
  Idea: Idea
}
