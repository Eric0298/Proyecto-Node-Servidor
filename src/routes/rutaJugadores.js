const express = require('express');
const Jugador = require('../models/Jugador');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jugadores = await Jugador
      .find()
      .populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener jugadores' });
  }
});

router.get('/posicion/:pos', async (req, res) => {
  try {
    const jugadores = await Jugador
      .find({ posicion: req.params.pos })
      .populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por posición' });
  }
});

router.get('/club/:idClub', async (req, res) => {
  try {
    const jugadores = await Jugador
      .find({ club: req.params.idClub })
      .populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por club' });
  }
});

router.get('/goles/:min/:max', async (req, res) => {
  try {
    const min = Number(req.params.min);
    const max = Number(req.params.max);
    const jugadores = await Jugador
      .find({ goles: { $gte: min, $lte: max } })
      .populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por goles' });
  }
});

router.get('/buscar-nombre/:texto', async (req, res) => {
  try {
    const regex = new RegExp(req.params.texto, 'i');
    const jugadores = await Jugador
      .find({ nombre: regex })
      .populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar por nombre' });
  }
});

router.get('/buscar-apellido/:texto', async (req, res) => {
  try {
    const regex = new RegExp(req.params.texto, 'i');
    const jugadores = await Jugador
      .find({ apellido: regex })
      .populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar por apellido' });
  }
});

router.get('/top-goles/:n', async (req, res) => {
  try {
    const n = Number(req.params.n) || 10;
    const jugadores = await Jugador
      .find()
      .sort({ goles: -1 })
      .limit(n)
      .populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener top goleadores' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const jugador = await Jugador
      .findById(req.params.id)
      .populate('club', 'nombre pais');
    if (!jugador) return res.status(404).json({ error: 'Jugador no encontrado' });
    return res.status(200).json(jugador);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener jugador' });
  }
});

router.post('/', async (req, res) => {
  try {
    const jugador = new Jugador(req.body);
    const guardado = await jugador.save();
    const jugadorCompleto = await Jugador
      .findById(guardado._id)
      .populate('club', 'nombre pais');
    return res.status(201).json(jugadorCompleto);
  } catch (error) {
    return res.status(400).json({
      error: 'Error al crear jugador',
      detalles: error.message,
      code: error.code,
      fields: error.errors
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Jugador.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('club', 'nombre pais');

    if (!actualizado) return res.status(404).json({ error: 'Jugador no encontrado' });
    return res.status(200).json(actualizado);
  } catch (error) {
    return res.status(400).json({
      error: 'Error al actualizar jugador',
      detalles: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Jugador.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Jugador no encontrado' });
    return res.status(200).json({
      mensaje: 'Jugador eliminado correctamente',
      jugadorEliminado: eliminado,
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar jugador' });
  }
});

module.exports = router;
