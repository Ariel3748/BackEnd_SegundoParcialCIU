const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "El nombre de la etique es obligatorio"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;
