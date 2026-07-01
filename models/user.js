const mongoose = require("mongoose");

const calcularEdad = (fechaNacimiento) => {
  const cumpleaños = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - cumpleaños.getFullYear();
  const mes = hoy.getMonth() - cumpleaños.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleaños.getDate())) {
    edad--;
  }
  return edad;
};

const userSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      required: [true, "NickName es obligatorio"],
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    birthdate: {
      type: Date,
      default: null,
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "Email es obligatorio"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      default: "123456",
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre("validate", function () {
  if (this.birthdate) {
    this.age = calcularEdad(this.birthdate);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
