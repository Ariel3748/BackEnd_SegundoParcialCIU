const Post = require("../models/post");
 
const validateCommentExists = async (req, res, next) => {
  try {
    const {idComment} = req.params
    const { postId} = req.body;
 
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post asociado no encontrado" });
    }
 
    const foundComment = post.comments.id(idComment);
    if (!foundComment) {
 
      return res
        .status(404)
        .json({ message: "Comentario no encontrado en este post" });
    }
 
    req.foundPost = post;
    req.foundComment = foundComment;
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error al validar el comentario",
      error: error.message,
    });
  }
};
 
module.exports = validateCommentExists;