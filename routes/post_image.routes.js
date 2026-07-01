const { Router } = require("express");
const router = Router();
const validatePostImageExists = require("../middlewares/validatePostImageExists");
const postImageController = require("../controllers/post_image.controllers");

router.post("/", postImageController.createImage);

router.get("/post/:postId", postImageController.getImagesByPost);

router.delete(
  "/:postId/:imageId",
  validatePostImageExists,
  postImageController.deleteImage,
);

module.exports = router;
