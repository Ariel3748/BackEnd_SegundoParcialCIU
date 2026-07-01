const Joi = require("joi");

const userSchema = Joi.object({
  nickName: Joi.string().min(3).max(30).required().messages({
    "string.base": "El nombre de usuario debe ser texto",
    "string.empty": "El nombre de usuario no puede estar vacío",
  }),
  firstName: Joi.string().min(3).max(30).optional().allow("").messages({
    "string.base": "El nombre debe ser texto",
  }),
  lastName: Joi.string().min(3).max(30).optional().allow("").messages({
    "string.base": "El apellido debe ser texto",
  }),
  birthdate: Joi.date().less("now").optional().messages({
    "date.less": "La fecha de nacimiento debe ser una fecha pasada",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "El email debe ser una dirección de correo válida",
  }),
  password: Joi.string().min(4).max(30).optional().default("123456"),
});

module.exports = { userSchema };
