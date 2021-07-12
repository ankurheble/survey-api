const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: String,
  options: [mongoose.Schema.Types.Mixed],
  answer: mongoose.Schema.Types.Mixed,
  survey: {
    ref: "Survey",
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model("Question", questionSchema);
