const express = require('express');
const Competicion = require('../models/Competicion');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const competiciones = await Competicion.find();
    return res.status(200).json(competiciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener competiciones' });
  }
});

router.get('/tipo/:tipo', async (req, res) => {
  try {
    const competiciones = await Competicion.find({ tipo: req.params.tipo });
    return res.status(200).json(competiciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por tipo' });
  }
});

router.get('/pais/:pais', async (req, res) => {
  try {
    const competiciones = await Competicion.find({ pais: req.params.pais });
    return res.status(200).json(competiciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por país' });
  }
});

router.get('/nombre/:nombre/temporada/:temporada', async (req, res) => {
  try {
    const { nombre, temporada } = req.params;
    const competicion = await Competicion.findOne({ nombre, temporada });
    if (!competicion) return res.status(404).json({ error: 'Competición no encontrada' });
    return res.status(200).json(competicion);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener competición por nombre y temporada' });
  }
});

router.get('/edicion/:min/:max', async (req, res) => {
  try {
    const min = Number(req.params.min);
    const max = Number(req.params.max);

    const competiciones = await Competicion.find({
      edicion: { $gte: min, $lte: max }
    });

    return res.status(200).json(competiciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por edición' });
  }
});

router.get('/buscar-nombre/:texto', async (req, res) => {
  try {
    const regex = new RegExp(req.params.texto, 'i');
    const competiciones = await Competicion.find({ nombre: regex });
    return res.status(200).json(competiciones);
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar competiciones por nombre' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const competicion = await Competicion.findById(req.params.id);
    if (!competicion) return res.status(404).json({ error: 'Competición no encontrada' });
    return res.status(200).json(competicion);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener competición' });
  }
});

router.post('/', async (req, res) => {
  try {
    const competicion = new Competicion(req.body);
    const guardada = await competicion.save();
    return res.status(201).json(guardada);
  } catch (error) {
    return res.status(400).json({
      error: 'Error al crear competición',
      detalles: error.message,
      code: error.code,
      fields: error.errors
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizada = await Competicion.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!actualizada) return res.status(404).json({ error: 'Competición no encontrada' });
    return res.status(200).json(actualizada);
  } catch (error) {
    return res.status(400).json({
      error: 'Error al actualizar competición',
      detalles: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const eliminada = await Competicion.findByIdAndDelete(req.params.id);
    if (!eliminada) return res.status(404).json({ error: 'Competición no encontrada' });
    return res.status(200).json({
      mensaje: 'Competición eliminada correctamente',
      competicionEliminada: eliminada,
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar competición' });
  }
});

module.exports = router;
