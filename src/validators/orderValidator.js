const { check, validationResult } = require('express-validator');

const orderValidationRules = () => {
  return [
    check('client_id').isInt().withMessage('Client ID must be an integer'),
    check('restaurant_id').isInt().withMessage('Restaurant ID must be an integer'),
    check('delivery_person_id').optional().isInt().withMessage('Delivery person ID must be an integer'),
    check('status').notEmpty().withMessage('Status is required'),
    check('delivery_address').notEmpty().withMessage('Delivery address is required')
  ];
};

const validateOrder = (req, res, next) => {
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
  orderValidationRules,
  validateOrder,
};
