var express = require("express");
var router = express.Router();
var questionController = require("../controllers/questionController");
var Joi = require("joi");

router.post("/", createQuestionSchema, questionController.create);
router.get("/:id", questionController.getQuestion);
router.put("/:id", updateQuestionSchema, questionController.updateQuestion);

function createQuestionSchema(req, res, next) {
  const createQuestionSchemaObj = Joi.object({
    surveyId: Joi.string().required(),
    title: Joi.string().max(500).required(),
    options: Joi.array().items(
      Joi.alternatives()
        .try(Joi.string().max(250), Joi.number(), Joi.boolean())
        .required()
    ),
    answer: Joi.alternatives()
      .try(Joi.string().max(250), Joi.number(), Joi.boolean())
      .required(),
  });
  validateRequest(req, res, next, createQuestionSchemaObj);
}

function updateQuestionSchema(req, res, next) {
  const createQuestionSchemaObj = Joi.object({
    title: Joi.string().max(500).optional(),
    options: Joi.array().items(
      Joi.alternatives()
        .try(Joi.string().max(250), Joi.number(), Joi.boolean())
        .optional()
    ),
    answer: Joi.alternatives()
      .try(Joi.string().max(250), Joi.number(), Joi.boolean())
      .optional(),
  });
  validateRequest(req, res, next, createQuestionSchemaObj);
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
