const { Router } = require("express");
const router = Router();
const postController = require("../controllers/post.controllers");
const validatePost = require("../middlewares/validatePost");
const validatePostExists = require("../middlewares/validatePostExists");
const validateAuthorExists = require("../middlewares/validateAuthorExists");
const checkCachePost = require("../middlewares/checkCachePost");

router.get("/", postController.getAllPosts);
router.get(
  "/:id",
  checkCachePost,
  validatePostExists,
  postController.getPostById,
);
router.post("/", validatePost, validateAuthorExists, postController.createPost);
router.post("/:id/tags", validatePostExists, postController.associateTagToPost);
router.delete("/:id", validatePostExists, postController.deletePost);
router.put(
  "/:postId",
  validatePost,
  validatePostExists,
  postController.editPost,
); 

module.exports = router;
