const Post = require("../models/post");

const validatePostImageExists = async (req, res, next) => {
  try {
    const { postId, imageId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post asociado no encontrado" });
    }

    const foundImage = post.images.id(imageId);
    if (!foundImage) {
      return res
        .status(404)
        .json({ error: "Imagen no encontrada en este post" });
    }

    req.foundPost = post;
    req.foundImage = foundImage;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al validar la imagen", error: error.message });
  }
};

module.exports = validatePostImageExists;
