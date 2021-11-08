const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const patternPhone = '\\(\\d{3}\\)\\d{3}-\\d{4}';
const schemaContact = Joi.object({
  name: Joi.string().alphanum().min(1).max(20).required(),
  email: Joi.string().optional(),
  phone: Joi.string().pattern(new RegExp(patternPhone)).required(),
  favorite: Joi.boolean().optional(),
});

const schemaId = Joi.object({
  contactId: Joi.objectId().required(),
});

const schemaFavoriteContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, obj, res, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: `Field ${err.message.replace(/"/g, '')}`,
    });
  }
};

module.exports.validateContact = async (req, res, next) => {
  return await validate(schemaContact, req.body, res, next);
};

module.exports.validateFavoriteContact = async (req, res, next) => {
  return await validate(schemaFavoriteContact, req.body, res, next);
};

module.exports.validateId = async (req, res, next) => {
  return await validate(schemaId, req.params, res, next);
};
