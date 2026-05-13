require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db"); 
const eventosRoutes = require("./routes/eventos.routes");
const iniciarPuente = require('./services/serialBridge');

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Healthcheck
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Rutas
app.use("/eventos", eventosRoutes);

// Ruta inexistente
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// FUNCIÓN DE ARRANQUE (Aquí es donde ocurre la magia)
const startServer = async () => {
  try {
    // 1. Intentamos conectar a la base de datos
    await connectDB(); 
    
    // 2. Una vez conectada, levantamos el servidor
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      
      // 3. Iniciamos el puente serial
      iniciarPuente(); 
    });
  } catch (error) {
    console.error("❌ No se pudo iniciar el sistema:", error.message);
    process.exit(1);
  }
};

// Ejecutar el inicio
startServer();