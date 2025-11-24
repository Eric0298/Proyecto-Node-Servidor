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

router.get('/:id', async (req, res) => {
  try {
    const insc = await ClubCompeticion
      .findById(req.params.id)
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');
    if (!insc) return res.status(404).json({ error: 'Inscripción no encontrada' });
    return res.status(200).json(insc);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la inscripción' });
  }
});

router.get('/competicion/:idCompeticion', async (req, res) => {
  try {
    const lista = await ClubCompeticion
      .find({ competicion: req.params.idCompeticion })
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');
    return res.status(200).json(lista);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por competición' });
  }
});

router.get('/club/:idClub', async (req, res) => {
  try {
    const lista = await ClubCompeticion
      .find({ club: req.params.idClub })
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');
    return res.status(200).json(lista);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por club' });
  }
});

router.get('/clasificacion/:idCompeticion', async (req, res) => {
  try {
    const tabla = await ClubCompeticion
      .find({ competicion: req.params.idCompeticion })
      .sort({ puntos: -1, goles_favor: -1 })
      .populate('club', 'nombre pais');
    return res.status(200).json(tabla);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener la clasificación' });
  }
});

router.get('/puntos/:min/:max', async (req, res) => {
  try {
    const min = Number(req.params.min);
    const max = Number(req.params.max);
    const lista = await ClubCompeticion
      .find({ puntos: { $gte: min, $lte: max } })
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');
    return res.status(200).json(lista);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por puntos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const nueva = new ClubCompeticion(req.body);
    await nueva.save();

    const creada = await ClubCompeticion.findById(nueva._id)
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');

    return res.status(201).json(creada);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: 'Error al crear la inscripción',
      detalles: error.message,
      code: error.code,
      fields: error.errors
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizado = await ClubCompeticion.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate('club', 'nombre pais')
      .populate('competicion', 'nombre temporada pais');

    if (!actualizado) return res.status(404).json({ error: 'Inscripción no encontrada' });

    return res.status(200).json({
      mensaje: 'Inscripción actualizada correctamente',
      inscripcionActualizada: actualizado,
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(400).json({ error: 'Error al actualizar la inscripción', detalles: error.message });
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
