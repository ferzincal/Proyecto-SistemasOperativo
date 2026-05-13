const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const Evento = require('../models/Evento'); // Ruta relativa a tu modelo

// No necesitas conectar a la DB aquí si ya lo haces en app.js
// Pero el Bridge debe iniciarse cuando la DB esté lista.

const iniciarPuente = () => {
  const port = new SerialPort({
    path: process.env.SERIAL_PORT || 'COM3', // Usa variables de entorno
    baudRate: 9600,
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  console.log('🔌 Servicio de puente Serial iniciado...');

  parser.on('data', async (data) => {
    try {
      const [tipoRaw, valorRaw] = data.split(':');
      if (!tipoRaw || !valorRaw) return;

      const nuevoEvento = new Evento({
        tipo: tipoRaw.toLowerCase(),
        valor: parseFloat(valorRaw),
        origen: 'arduino',
        estado: (tipoRaw === 'ERROR') ? 'error' : 'activo'
      });

      await nuevoEvento.save();
      console.log(`🤖 Arduino dice: ${tipoRaw} -> ${valorRaw}`);
    } catch (error) {
      console.error('❌ Error en Bridge:', error.message);
    }
  });
};

module.exports = iniciarPuente;