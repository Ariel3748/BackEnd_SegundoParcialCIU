const Joi = require("joi");

const postSchema = Joi.object({
  description: Joi.string().min(3).max(500).required().messages({
    "string.base": "La descripción debe ser texto",
    "string.empty": "La descripción no puede estar vacía",
    "string.min": "La descripción debe tener al menos 3 caracteres",
    "string.max": "La descripción no puede superar los 500 caracteres",
  }),
  author: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.empty": "El ID del autor es requerido",
      "string.pattern.base":
        "El ID del autor debe ser un ObjectId válido de MongoDB (24 caracteres hexadecimales)",
    }),
  tags: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).default([]),
});

module.exports = { postSchema };
