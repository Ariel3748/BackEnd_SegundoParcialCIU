const Post = require("../models/post"); 

const validatePostExists = async (req, res, next) => {
  try {
    const id = req.params.id || req.params.postId || req.body.postId;
    
    const foundPost = await Post.findById(id);

    if (!foundPost) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    req.foundPost = foundPost;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al validar el post", error: error.message });
  }
};

module.exports = validatePostExists;