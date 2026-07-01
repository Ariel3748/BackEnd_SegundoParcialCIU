const { string } = require("joi");
const mongoose = require("mongoose");

const postImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: [true, "La URL de la imagen es obligatoria"],
    },
  },
  { timestamps: true },
);

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      require: [true, " El texto del comentario es obligario"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: [true, "El autor del comentario es obligario"],
    },
    votes:{
      type: Number,
      require: [true, "Los votos son obligatorios"]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

commentSchema.virtual("visible").get(function () {
  const monthsLimit = parseInt(process.env.COMMENT_VISIBLE_MONTHS) || 6;
  const cutOffDate = new Date();
  cutOffDate.setMonth(cutOffDate.getMonth() - monthsLimit);
  return this.createdAt >= cutOffDate;
});

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      require: [true, "La descripcion es obligaria"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: [true, "El autor es obligatorio"],
    },
    votes:{
      type: Number,
      require: [true, "Los votos son obligatorios"]
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
      
    ],
    images: [postImageSchema],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
