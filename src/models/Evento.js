const mongoose = require("mongoose");

const EventoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: [true, "El tipo de evento es obligatorio"],
    enum: {
      values: [
        "abrir_garra",
        "cerrar_garra",
        "movimiento",
        "error",
        "objeto_detectado",    // Disparado por el ultrasónico
        "medicion_distancia",  // Lectura constante del ultrasónico (cm)
        "servo_detenido",
        "temperatura_alta"
      ],
      message: '{VALUE} no es un tipo de evento válido'
    },
    trim: true
  },
  robot: {
    type: String,
    default: "garra_1",
    trim: true
  },
  estado: {
    type: String,
    required: true,
    enum: {
      values: ["activo", "inactivo", "error", "alerta"],
      message: '{VALUE} no es un estado permitido'
    },
    default: "activo"
  },
  valor: {
    type: Number,
    required: [true, "El valor numérico es obligatorio"],
    min: [0, "El valor no puede ser negativo"],
    // Nota: Se eliminó el max: 100 para permitir lecturas del ultrasónico de hasta 400cm
  },
  mensaje: {
    type: String,
    maxlength: [100, "El mensaje no puede exceder los 100 caracteres"],
    trim: true,
    default: function() {
      // Si no envías mensaje, se genera uno acorde al tipo
      const mensajesDefault = {
        "medicion_distancia": `Lectura de proximidad: ${this.valor}cm`,
        "objeto_detectado": "¡Objeto detectado en el rango!",
        "movimiento": `Rotación a ${this.valor} grados`,
        "error": "Se ha producido una falla en el sistema"
      };
      return mensajesDefault[this.tipo] || `Evento ${this.tipo} registrado`;
    }
  },
  origen: {
    type: String,
    required: true,
    enum: ["arduino", "backend", "frontend", "simulacion"],
    default: "arduino"
  }
}, {
  // Crea automáticamente createdAt y updatedAt
  timestamps: true 
});

// ÍNDICES: Crucial para que cuando tengas miles de datos del ultrasónico, 
// el dashboard de tu frontend siga siendo rápido.
EventoSchema.index({ createdAt: -1 });
EventoSchema.index({ tipo: 1 });

module.exports = mongoose.model("Evento", EventoSchema);