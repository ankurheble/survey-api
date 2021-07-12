const mongoose = require("mongoose");

const surveySchema = new mongoose.Schema({
  title: String,
  questions: [
    {
      ref: "Question",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

module.exports = mongoose.model("Survey", surveySchema);
