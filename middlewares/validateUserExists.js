const  User  = require("../models/user");

const validateUserExists = async (req, res, next) => {
  try {
    const { nickName } = req.params
    const foundUser = await User.findOne({ nickName });

    if (!foundUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    req.foundUser = foundUser;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al validar el usuario", error: error.message });
  }
};

module.exports = validateUserExists;
