const Post = require("../models/post");
const Tag = require("../models/tag");
const cache = require("../config/redisClient");
const { invalidateCache } = require("../services/cache.service");

const filterOldComments = (post) => {
  const postObject = post.toObject ? post.toObject({ virtuals: true }) : post;
  if (postObject.comments) {
    postObject.comments = postObject.comments.filter((c) => c.visible);
  }
  return postObject;
};

const createPost = async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    await invalidateCache(["posts:all"]);
    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear el Post", error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { author: userId } : {};
    const cacheKey = userId ? `posts:user:${userId}` : "posts:all";

    if (cache.isReady) {
      const cachePosts = await cache.get(cacheKey);
      if (cachePosts) return res.status(200).json(JSON.parse(cachePosts));
    }

    let posts = await Post.find(filter)
      .populate("author", "nickName firstName lastName")
      .populate("tags", "name")
      .populate("comments.author", "nickName")
      .sort({ createdAt: -1 });

    posts = posts.map(filterOldComments);

    if (cache.isReady && posts.length > 0) {
      await cache.set(cacheKey, JSON.stringify(posts), { EX: 300 });
    }
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los Posts", error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `post:${id}`;

    if (cache.isReady) {
      const cachedPost = await cache.get(cacheKey);
      if (cachedPost) return res.status(200).json(JSON.parse(cachedPost));
    }

    const foundPost = await Post.findById(id)
      .populate("author", "nickName firstName lastName")
      .populate("tags", "name")
      .populate("comments.author", "nickName");

    if (!foundPost)
      return res.status(404).json({ message: "Post no encontrado" });

    const postFiltered = filterOldComments(foundPost);

    if (cache.isReady) {
      await cache.set(cacheKey, JSON.stringify(postFiltered), { EX: 300 });
    }
    res.status(200).json(postFiltered);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el post", error: error.message });
  }
};

const associateTagToPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { tagId } = req.body;

    const post = await Post.findById(id);
    const tag = await Tag.findById(tagId);

    if (!tag || !post)
      return res.status(404).json({ error: "Post o tag no encontrado" });

    if (!post.tags.includes(tagId)) {
      post.tags.push(tagId);
      await post.save();
    }

    await invalidateCache([`post:${id}`, "posts:all"]);
    return res
      .status(201)
      .json({ message: "Etiqueta vinculada al post con éxito" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error al vincular Etiqueta", error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);

    await invalidateCache([`post:${id}`, "posts:all"]);
    return res.status(200).json({ message: "Post eliminado con éxito" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al eliminar el Post", error: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { description } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: { description } },
      { new: true, runValidators: true },
    );

    await invalidateCache([`post:${postId}`, "posts:all"]);
    res
      .status(200)
      .json({ message: "Post editado con éxito", post: updatedPost });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al editar el post", error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  associateTagToPost,
  deletePost,
  editPost,
};
