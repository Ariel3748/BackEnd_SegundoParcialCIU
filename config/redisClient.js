const { createClient } = require("redis");
require("dotenv").config();

const cache = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // URL de conexión a Redis, configurable a través de variables de entorno
  disableOfflineQueue: true,
  socket: {
    connectTimeout: 1500,
  },
});

cache.on("error", (error) => {
  console.error("Redis status: Offline");
});

module.exports = cache;
