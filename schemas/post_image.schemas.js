const Joi = require("joi");

const postImageSchema = Joi.object({
  postId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.empty": "El ID del post es requerido",
      "string.pattern.base":
        "El ID del post debe ser un ObjectId válido de MongoDB",
    }),
  image: Joi.any(),
});

module.exports = { postImageSchema };
