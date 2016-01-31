var mongoose = require("mongoose");

var MilestoneSchema = new mongoose.Schema({
  title: {type: String},
  date: {type: Date},
  description: {type: String},
  user_email: {type: String, index: true},
  rating: {type: Number, default: 0, index: true},
  selected: {type: Boolean, default: false}
});

MilestoneSchema.statics.get = function(offset, count, cb) {
  return this.find({}, cb).skip(offset).limit(count)
}

MilestoneSchema.methods.rate = function (rating, cb) {
  return this.model('Milestone').update({ _id: this._id }, { $inc: { rating: rating}}, cb);
}

MilestoneSchema.methods.select = function (cb) {
  return this.model('Milestone').update({ _id: this._id }, {selected: true}, cb);
}

var Milestone = mongoose.model('Milestone', MilestoneSchema);

module.exports = {
  Milestone: Milestone
}
