const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connString = process.env.MONGO_URI;
    
    if (!connString) {
      throw new Error('La variable de entorno MONGO_URI no está definida');
    }

    await mongoose.connect(connString);
    

    const isLocal = connString.includes('localhost') || connString.includes('127.0.0.1');
    console.log(`Conexión exitosa a MongoDB (${isLocal ? 'Local' : 'Atlas Cloud'})`);
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    process.exit(1);
  }
};

module.exports = connectDB;