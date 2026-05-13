const mongoose = require("mongoose");

// Definimos la función
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error.message}`);
    process.exit(1);
  }
};

// EXPORTACIÓN CLAVE: Asegúrate de que NO tenga llaves si la importas sin llaves
module.exports = connectDB;