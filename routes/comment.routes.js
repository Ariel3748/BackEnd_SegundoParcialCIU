const { Router } = require("express");
const router = Router();
const commentController = require("../controllers/comment.controllers");
const validateComment = require("../middlewares/validateComment");
const validateCommentExists = require("../middlewares/validateCommentExists");
const validateAuthorExists = require("../middlewares/validateAuthorExists");

router.get("/post/:postId", commentController.getCommentsByPost);
router.get("/:idComment", commentController.getCommentById);
router.post(
  "/",
  validateComment,
  validateAuthorExists,
  commentController.createComment,
);

router.delete(
  "/:idComment",
  validateCommentExists,
  commentController.deleteComment,
);

router.put(
  "/:idComment",
  validateComment,
  validateCommentExists,
  commentController.editComment,
);

module.exports = router;
