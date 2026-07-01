const { postImageSchema } = require("../schemas/postImage.schemas");

const validatePostImage = (req, res, next) => {
  const { error } = postImageSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Datos inválidos para la imagen del post.",
      details: error.details.map((e) => e.message),
    });
  }
  next();
};

module.exports = validatePostImage;
