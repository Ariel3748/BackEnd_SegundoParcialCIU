const User = require("../models/user");
 
const validateAuthorExists = async (req, res, next) => {
  try {
    const { author } = req.body;
 
    const foundUser = await User.findById(author);
 
    if (!foundUser) {
      return res.status(404).json({ error: "El autor indicado no existe" });
    }
 
    req.foundAuthor = foundUser;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al validar el autor", error: error.message });
  }
};
 
module.exports = validateAuthorExists;
 