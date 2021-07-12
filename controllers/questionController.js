const Survey = require("../models/Survey");
const Question = require("../models/Question");

module.exports = {
  create: function (req, res) {
    const questionCreateRequest = req.body;
    Survey.findById(questionCreateRequest.surveyId)
      .then((survey) => {
        if (survey.questions.length >= 10) {
          return res.status(400).json({
            status: "failure",
            data: null,
            message: "Only 10 questions per survey is allowed",
          });
        }
        let question = new Question();
        question.title = questionCreateRequest.title;
        question.options = questionCreateRequest.options;
        question.answer = questionCreateRequest.answer;
        question.survey = survey.id;
        question.save();
        survey.questions.push(question);
        survey.save();
        return res.status(201).json({ status: "success" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ status: "success", data: null });
      });
  },

  getQuestion: function (req, res) {
    let questionId = req.params.id;
    Question.findById(questionId)
      .then((question) => {
        return res
          .status(200)
          .json({ status: "success", data: question ? question : null });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ status: "failure", data: null });
      });
  },

  updateQuestion: function (req, res) {
    let questionId = req.params.id;
    let updateData = req.body;
    Question.findById(questionId)
      .then((question) => {
        if (question) {
          if (updateData.answer) {
            question.answer = updateData.answer;
          }
          if (updateData.options) {
            question.options = updateData.options;
          }
          if (updateData.title) {
            question.title = updateData.title;
          }
          question.save();
          return res.status(200).json({ status: "success", data: question });
        }
        return res.status(404).json({
          status: "failure",
          data: null,
          message: "Question Not found",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ status: "failure", data: null });
      });
  },
};
