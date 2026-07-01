const Joi = require("joi");

const tagSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": "El nombre de la etiqueta debe ser texto",
    "string.empty": "El nombre de la etiqueta no puede estar vacío",
  }),
});

module.exports = { tagSchema };
