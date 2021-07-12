const Survey = require("../models/Survey");
const Question = require("../models/Question");

module.exports = {
  create: function (req, res) {
    const surveyReqBody = req.body;
    let areOptionsValid = false;

    // Check for max amount of questions
    if (surveyReqBody.questions.length > 10) {
      return res.status(400).json({
        status: "failure",
        data: null,
        message: "Only 10 questions per survey is allowed",
      });
    }

    // Check for validity of options and answer
    areOptionsValid = surveyReqBody.questions.some((questionObj) => {
      if (!questionObj.options.includes(questionObj.answer)) {
        return true;
      }
      return false;
    });
    if (areOptionsValid) {
      return res.status(400).json({
        status: "failure",
        data: null,
        message: "Answer should be part of options",
      });
    }

    let survey = new Survey();
    survey.title = surveyReqBody.title;
    survey.questions = [];

    surveyReqBody.questions.forEach((questionObj) => {
      let question = new Question();
      question.survey = survey.id;
      question.title = questionObj.title;
      question.options = questionObj.options;
      question.answer = questionObj.answer;
      question.save();
      survey.questions.push(question);
    });
    survey.save();
    return res.status(201).json({ status: "success", data: survey });
  },

  getSurvey: function (req, res) {
    const surveyId = req.params.id;
    Survey.findById(surveyId)
      .populate("questions")
      .then((survey) => {
        res
          .status(200)
          .json({ status: "success", data: survey ? survey : null });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ status: "failure", data: null });
      });
  },
};
