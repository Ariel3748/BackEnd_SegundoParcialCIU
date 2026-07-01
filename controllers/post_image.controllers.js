const Post = require("../models/post");
const fs = require("fs");
const path = require("path");
const { invalidateCache } = require("../services/cache.service");

const createImage = async (req, res) => {
  try {
    const { url, postId } = req.body;
    if (!url) return res.status(400).json({ message: "No se proporcionó una URL de imagen." });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    post.images.push({ imageUrl: url });
    await post.save();

    await invalidateCache([`post:${postId}`, "posts:all"]);
    const nuevaImagen = post.images[post.images.length - 1];
    res.status(201).json({ message: "Imagen asociada exitosamente", _id: nuevaImagen._id, imageUrl: url });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al asociar la imagen.", error: error.message });
  }
};

const getImagesByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });
    res.status(200).json(post.images);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener las imágenes del post",
        error: error.message,
      });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { postId, imageId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    const image = await post.images.id(imageId);
    if (!image)
      return res
        .status(404)
        .json({ message: "Imagen no encontrada en este post" });

    const filename = path.basename(image.imageUrl);
    const filePath = path.join(__dirname, "..", "public", "uploads", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    post.images.pull({ _id: imageId });
    await post.save();

    await invalidateCache([`post:${postId}`, "posts:all"]);
    res.status(200).json({ message: "Imagen eliminada correctamente." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la imagen.", error: error.message });
  }
};

module.exports = { createImage, getImagesByPost, deleteImage };
