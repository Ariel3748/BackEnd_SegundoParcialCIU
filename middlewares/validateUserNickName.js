const validateUserNickName = (req, res, next) => {
  const nickName = req.params.nickName || req.body.nickName;
  if (!nickName || nickName.trim() === "") {
    return res
      .status(400)
      .json({
        error: "El parámetro nickName es requerido y no puede estar vacío",
      });
  }
  next();
};

module.exports = validateUserNickName;
