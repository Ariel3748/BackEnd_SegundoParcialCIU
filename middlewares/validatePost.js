const { postSchema } = require("../schemas/post.schemas");

const validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validatePost;
