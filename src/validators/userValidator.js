const { check, validationResult } = require('express-validator');

const userValidationRules = () => {
  return [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password must be at least 6 characters long'),
    check('phone_number').notEmpty().withMessage('Phone number is required'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
  console.log('Validation errors:', extractedErrors); // Log errors to the console

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userValidationRules,
  validate,
};
