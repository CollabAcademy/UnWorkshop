var mongoose = require("mongoose");

var FormSchema = new mongoose.Schema({
  stage: { type: Number },
  question: String,
  description: String,
  form_schema: Object
});

FormSchema.statics.findByStage = function (stage, cb) {
  return this.find({ stage: stage }, cb);
}

var Form = mongoose.model('Form', FormSchema);

module.exports = {
  Form: Form
}
