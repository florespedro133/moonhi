const Joi = require("joi");

const validateInput = (req, res, next) => {
  const schema = Joi.object({
    number1: Joi.number().required(),
    number2: Joi.number().required(),
    operation: Joi.string().valid("+", "-", "*", "/").required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.details[0].message,
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

module.exports = validateInput;
