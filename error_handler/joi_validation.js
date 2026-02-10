const Joi = require("joi");

const joiCampgroundSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  price: Joi.number().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
}).required();

const joiReviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  body: Joi.string().required(),
}).required();

module.exports = { joiCampgroundSchema, joiReviewSchema };
