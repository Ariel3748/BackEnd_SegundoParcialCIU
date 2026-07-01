const cache = require("../config/redisClient");

const checkCachePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `post:${id}`;

    if (!cache.isReady) {
      console.log(
        "Redis no está listo (isReady: false). Pasando directo a la DB...",
      );
      return next();
    }

    const postEnCache = await cache.get(cacheKey);
    if (postEnCache) {
      console.log("Envio la respuesta desde redis");
      return res.status(200).json(JSON.parse(postEnCache));
    }
    next();
  } catch (error) {
    console.error("Error al leer cache:", error.message);
    next();
  }
};

module.exports = checkCachePost;
