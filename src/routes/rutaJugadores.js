const express = require('express');
const Jugador = require('../models/Jugador');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jugadores = await Jugador.find().populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener jugadores' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const jugador = await Jugador.findById(req.params.id).populate('club', 'nombre pais');
    if (!jugador) return res.status(404).json({ error: 'Jugador no encontrado' });
    return res.status(200).json(jugador);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener jugador' });
  }
});


router.get('/posicion/:pos', async (req, res) => {
  try {
    const jugadores = await Jugador.find({ posicion: req.params.pos }).populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por posición' });
  }
});

router.get('/club/:idClub', async (req, res) => {
  try {
    const jugadores = await Jugador.find({ club: req.params.idClub }).populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por club' });
  }
});

router.get('/goles/:min/:max', async (req, res) => {
  try {
    const min = Number(req.params.min);
    const max = Number(req.params.max);
    const jugadores = await Jugador.find({ goles: { $gte: min, $lte: max } }).populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por goles' });
  }
});

router.get('/buscar-nombre/:texto', async (req, res) => {
  try {
    const texto = req.params.texto;
    const jugadores = await Jugador.find({ nombre: { $regex: texto, $options: 'i' } }).populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error en búsqueda por nombre' });
  }
});

router.get('/buscar-apellido/:texto', async (req, res) => {
  try {
    const texto = req.params.texto;
    const jugadores = await Jugador.find({ apellido: { $regex: texto, $options: 'i' } }).populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error en búsqueda por apellido' });
  }
});

router.get('/top-goles/:n', async (req, res) => {
  try {
    const n = Number(req.params.n) || 5;
    const jugadores = await Jugador.find().sort({ goles: -1 }).limit(n).populate('club', 'nombre pais');
    return res.status(200).json(jugadores);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener top por goles' });
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

    return res.status(200).json({
      mensaje: 'Jugador actualizado correctamente',
      jugadorActualizado: actualizado,
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(400).json({ error: 'Error al actualizar jugador', detalles: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevoJugador = new Jugador(req.body);
    await nuevoJugador.save();

    const creado = await Jugador.findById(nuevoJugador._id)
      .populate('club', 'nombre pais');

    return res.status(201).json(creado);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: 'Error al crear jugador',
      detalles: error.message,
      code: error.code,
      fields: error.errors
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
