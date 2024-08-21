const { check, validationResult } = require('express-validator');

const lineOrderValidationRules = () => {
  return [
    check('order_id').isInt().withMessage('Order ID must be an integer'),
    check('product').notEmpty().withMessage('Product name is required'),
    check('quantity').isInt().withMessage('Quantity must be an integer'),
    check('unit_price').isFloat().withMessage('Unit price must be a float')
  ];
};

const validateLineOrder = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  lineOrderValidationRules,
  validateLineOrder,
};
