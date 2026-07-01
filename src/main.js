// Carga las variables de entorno desde el archivo .env
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// Carga el archivo YAML de Swagger de forma segura posterior al require
const swaggerDocument = YAML.load("./docs/swagger.yaml");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Conexión a MongoDB con Mongoose
const connectDB = async () => {
  try {
    const connString = process.env.MONGO_URI;
    if (!connString) {
      throw new Error('La variable de entorno MONGO_URI no está definida');
    }
    await mongoose.connect(connString);
    console.log('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

connectDB()

// Importar cliente de Redis
const cache = require("../config/redisClient");

// Manejo de Rutas de la API
app.use("/users", require("../routes/user.routes"));
app.use("/posts", require("../routes/post.routes"));
app.use("/tags", require("../routes/tag.routes"));
app.use("/comments", require("../routes/comment.routes"));
app.use("/postimages", require("../routes/post_image.routes"));

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(PORT, async () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(
    `Documentación de la API disponible en http://localhost:${PORT}/api-docs`,
  );

  // Conexión explícita de Redis v4
  try {
    await cache.connect();
    console.log("Conexión exitosa a Redis Caché.");
  } catch (error) {
    console.error("No se pudo conectar a Redis, trabajando sin capa de caché.");
  }
});

module.exports = app;
