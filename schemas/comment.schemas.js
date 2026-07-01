const Joi = require("joi");

const commentSchema = Joi.object({
  postId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.empty": "El ID del post es requerido",
      "string.pattern.base":
        "El ID del post debe ser un ObjectId válido de MongoDB",
    }),
  text: Joi.string().min(1).max(500).required().messages({
    "string.empty": "El texto del comentario no puede estar vacío",
    "string.min": "El texto del comentario debe tener al menos 1 carácter",
    "string.max": "El texto del comentario no puede superar los 500 caracteres",
  }),
  author: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.empty": "El ID del autor del comentario es requerido",
      "string.pattern.base": "El ID del autor debe ser un ObjectId válido",
    }),
});

const commentEditSchema = Joi.object({
  postId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.empty": "El ID del post es requerido",
      "string.pattern.base":
        "El ID del post debe ser un ObjectId válido de MongoDB",
    }),
  text: Joi.string().min(1).max(500).required().messages({
    "string.empty": "El texto del comentario no puede estar vacío",
    "string.min": "El texto del comentario debe tener al menos 1 carácter",
    "string.max": "El texto del comentario no puede superar los 500 caracteres",
  }),
});

module.exports = { commentSchema, commentEditSchema };
