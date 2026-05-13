const express = require("express");
const router = express.Router();
const {
  crearEvento,
  obtenerEventos,
  obtenerEvento,
  actualizarEvento,
  eliminarEvento,
  
} = require("../controllers/eventos.controller");
router.post("/", crearEvento);
router.get("/", obtenerEventos);
router.get("/:id", obtenerEvento);
router.put("/:id", actualizarEvento);
router.delete("/:id", eliminarEvento);
module.exports = router;
