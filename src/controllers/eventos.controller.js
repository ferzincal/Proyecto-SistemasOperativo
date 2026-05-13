const Evento = require("../models/Evento");
// Crear evento
const crearEvento = async (req, res) => {
  try {
    const { tipo, valor } = req.body;
    if (!tipo || valor === undefined) {
      return res.status(400).json({
        error: "tipo y valor son obligatorios",
      });
    }
    const evento = new Evento(req.body);
    await evento.save();
    res.status(201).json({
      mensaje: "Evento guardado",
      evento,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        error: error.message,
      });
    }
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
};
// Obtener todos
const obtenerEventos = async (req, res) => {
  try {
    const filtros = {};
    if (req.query.tipo) {
      filtros.tipo = req.query.tipo;
    }
    if (req.query.estado) {
      filtros.estado = req.query.estado;
    }
    const eventos = await Evento.find(filtros).sort({ createdAt: -1 });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener eventos",
    });
  }
};
// Obtener uno
const obtenerEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({
        error: "Evento no encontrado",
      });
    }
    res.json(evento);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener evento",
    });
  }
};
// Actualizar
const actualizarEvento = async (req, res) => {
  try {
    const evento = await Evento.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!evento) {
      return res.status(404).json({
        error: "Evento no encontrado",
      });
    }
    res.json({
      mensaje: "Evento actualizado",
      evento,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar evento",
    });
  }
};
// Eliminar
const eliminarEvento = async (req, res) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);
    if (!evento) {
      return res.status(404).json({
        error: "Evento no encontrado",
      });
    }
    res.json({
      mensaje: "Evento eliminado",
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar evento",
    });
  }
};
module.exports = {
  crearEvento,
  obtenerEventos,
  obtenerEvento,
  actualizarEvento,
  eliminarEvento,
};
