const { Router } = require("express");
const router = Router();
const userController = require("../controllers/user.controllers");
const validarUser = require("../middlewares/validateUser");
const validarUserNickName = require("../middlewares/validateUserNickName");
const validateUserExists = require("../middlewares/validateUserExists");

router.get("/", userController.getAllUsers);
router.get(
  "/:nickName",
  validarUserNickName,
  validateUserExists,
  userController.getUserByNickName,
);
router.post("/", validarUser, userController.createUser);
router.put(
  "/:nickName",
  validarUserNickName,
  validateUserExists,
  validarUser,
  userController.updateUser,
);
router.delete(
  "/:nickName",
  validarUserNickName,
  validateUserExists,
  userController.deleteUser,
);
router.post("/follow", userController.followUser);
router.post("/login", userController.loginUser);

module.exports = router;
