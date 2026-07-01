const Post = require("../models/post");
const User = require("../models/user");
const { invalidateCache } = require("../services/cache.service");

const filterOldComments = (post) => {
  const postObject = post.toObject ? post.toObject({ virtuals: true }) : post;
  if (postObject.comments) {
    postObject.comments = postObject.comments.filter((c) => c.visible);
  }
  return postObject;
};

const createComment = async (req, res) => {
  try {
    const { postId, text, author } = req.body;
    const userExists = await User.findById(author);
    if (!userExists)
      return res
        .status(404)
        .json({ message: "El usuario que intenta comentar no existe." });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    post.comments.push({ text, author });
    await post.save();

    await invalidateCache([
      `post:${postId}`,
      "posts:all",
      `posts:user:${post.author}`,
    ]);
    res.status(201).json({ message: "Comentario agregado con éxito" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear el comentario", error: error.message });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate(
      "comments.author",
      "nickName",
    );
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    const postFiltered = filterOldComments(post);
    res.status(200).json(postFiltered.comments);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener los comentarios",
        error: error.message,
      });
  }
};

const getCommentById = async (req, res) => {
  try {
    const { idComment } = req.params;
    const { postId } = req.query;
    const post = await Post.findById(postId).populate(
      "comments.author",
      "nickName",
    );

    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    const comment = post.comments.id(idComment);
    if (!comment)
      return res.status(404).json({ message: "Comentario no encontrado" });

    res.status(200).json(comment);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener el comentario",
        error: error.message,
      });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { idComment } = req.params;
    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    post.comments.pull({ _id: idComment });
    await post.save();

    await invalidateCache([
      `post:${postId}`,
      "posts:all",
      `posts:user:${post.author}`,
    ]);
    return res.status(200).json({ message: "Comentario eliminado con éxito" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al eliminar el comentario",
        error: error.message,
      });
  }
};

const editComment = async (req, res) => {
  try {
    const { idComment } = req.params;
    const { postId, text } = req.body;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId, "comments._id": idComment },
      { $set: { "comments.$.text": text } },
      { returnDocument: 'after' },
    );

    if (!updatedPost)
      return res
        .status(404)
        .json({ message: "Post o comentario no encontrado" });

    await invalidateCache([
      `post:${postId}`,
      "posts:all",
      `posts:user:${updatedPost.author}`,
    ]);
    res.status(200).json({ message: "Comentario editado con éxito" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al editar el comentario", error: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  getCommentById,
  deleteComment,
  editComment,
};
