var express = require("express");
var router = express.Router();
var surveyController = require("../controllers/surveyController");
var Joi = require("joi");

router.post("/", createSurveySchema, surveyController.create);
router.get("/:id", surveyController.getSurvey);

function createSurveySchema(req, res, next) {
  const createSurveySchemaObj = Joi.object({
    title: Joi.string().max(500).required(),
    questions: Joi.array().items(
      Joi.object({
        title: Joi.string().max(500).required(),
        options: Joi.array().items(
          Joi.alternatives()
            .try(Joi.string().max(250), Joi.number(), Joi.boolean())
            .required()
        ),
        answer: Joi.alternatives()
          .try(Joi.string().max(250), Joi.number(), Joi.boolean())
          .required(),
      })
    ),
  });
  validateRequest(req, res, next, createSurveySchemaObj);
}

function validateRequest(req, res, next, schema) {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { error, value } = schema.validate(req.body, options);
  if (error) {
    let message = `Validation error: ${error.details
      .map((x) => x.message)
      .join(", ")}`;
    console.log(message);
    res.status(400).send({ status: "failure", data: null, message });
  } else {
    req.body = value;
    next();
  }
}

module.exports = router;
