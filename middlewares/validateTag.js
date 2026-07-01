const { tagSchema } = require("../schemas/tag.schemas");

const validateTag = (req, res, next) => {
  const { error } = tagSchema.validate(req.body);
  if (error) {
    return res.status(400).json(error.details[0].message );
  }
  next();
};

module.exports = validateTag;
