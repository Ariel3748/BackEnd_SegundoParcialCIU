const { Router } = require("express");
const router = Router();
const tagController = require("../controllers/tag.controllers");
const validateTag = require("../middlewares/validateTag");

router.get("/", tagController.getAllTags);
router.post("/", validateTag, tagController.createTag);
router.put("/:id", validateTag, tagController.editTag);
router.delete("/:id", tagController.deleteTag);

module.exports = router;
