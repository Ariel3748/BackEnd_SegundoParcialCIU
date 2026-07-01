const cache = require("../config/redisClient");

/**
 * Invalida (elimina) un array de claves en Redis.
 * @param {Array<string>} keys - Claves a eliminar.
 */
const invalidateCache = async (keys = []) => {
  if (!cache.isReady) return;

  try {
    const deletePromises = keys.map((key) => cache.del(key));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error al invalidar caché en Redis:", error.message);
  }
};

module.exports = { invalidateCache };