const express = require('express');
const ClubCompeticion = require('../models/ClubCompeticion');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const inscripciones = await ClubCompeticion
      .find()
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');
    return res.status(200).json(inscripciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener las inscripciones' });
  }
});


router.get('/competicion/:idCompeticion', async (req, res) => {
  try {
    const inscripciones = await ClubCompeticion
      .find({ competicion: req.params.idCompeticion })
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');
    return res.status(200).json(inscripciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener inscripciones por competición' });
  }
});

router.get('/club/:idClub', async (req, res) => {
  try {
    const inscripciones = await ClubCompeticion
      .find({ club: req.params.idClub })
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');
    return res.status(200).json(inscripciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener inscripciones por club' });
  }
});

router.get('/clasificacion/:idCompeticion', async (req, res) => {
  try {
    const clasificacion = await ClubCompeticion
      .find({ competicion: req.params.idCompeticion })
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais')
      .sort({ puntos: -1, goles_favor: -1 });
    return res.status(200).json(clasificacion);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener clasificación' });
  }
});

router.get('/puntos/:min/:max', async (req, res) => {
  try {
    const min = Number(req.params.min);
    const max = Number(req.params.max);

    const inscripciones = await ClubCompeticion
      .find({ puntos: { $gte: min, $lte: max } })
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');

    return res.status(200).json(inscripciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por puntos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const inscripcion = await ClubCompeticion
      .findById(req.params.id)
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');
    if (!inscripcion) return res.status(404).json({ error: 'Inscripción no encontrada' });
    return res.status(200).json(inscripcion);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener inscripción' });
  }
});

router.post('/', async (req, res) => {
  try {
    const inscripcion = new ClubCompeticion(req.body);
    const guardada = await inscripcion.save();
    const completa = await ClubCompeticion
      .findById(guardada._id)
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');
    return res.status(201).json(completa);
  } catch (error) {
    return res.status(400).json({
      error: 'Error al crear inscripción',
      detalles: error.message,
      code: error.code,
      fields: error.errors
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizada = await ClubCompeticion.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');

    if (!actualizada) return res.status(404).json({ error: 'Inscripción no encontrada' });
    return res.status(200).json(actualizada);
  } catch (error) {
    return res.status(400).json({
      error: 'Error al actualizar inscripción',
      detalles: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await ClubCompeticion.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Inscripción no encontrada' });
    return res.status(200).json({
      mensaje: 'Inscripción eliminada correctamente',
      inscripcionEliminada: eliminado,
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar la inscripción' });
  }
});

module.exports = router;
