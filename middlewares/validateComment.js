const { commentSchema, commentEditSchema } = require("../schemas/comment.schemas");
 
const validateComments = (req, res, next) => {
  const schema = req.method === "PUT" ? commentEditSchema : commentSchema;
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
 
module.exports = validateComments;