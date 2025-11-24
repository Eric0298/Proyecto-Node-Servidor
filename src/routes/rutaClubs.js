const express = require('express');
const Club = require('../models/Club');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find();
    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener clubes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club no encontrado' });
    return res.status(200).json(club);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener club' });
  }
});

router.get('/pais/:pais', async (req, res) => {
  try {
    const clubs = await Club.find({ pais: req.params.pais });
    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por país' });
  }
});

router.get('/ciudad/:ciudad', async (req, res) => {
  try {
    const clubs = await Club.find({ ciudad: req.params.ciudad });
    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por ciudad' });
  }
});

router.get('/buscar-nombre/:texto', async (req, res) => {
  try {
    const texto = req.params.texto;
    const clubs = await Club.find({ nombre: { $regex: texto, $options: 'i' } });
    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(500).json({ error: 'Error en búsqueda por nombre' });
  }
});

router.get('/fundacion/:min/:max', async (req, res) => {
  try {
    const min = new Date(req.params.min);
    const max = new Date(req.params.max);
    const clubs = await Club.find({ fundacion: { $gte: min, $lte: max } });
    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por fundación' });
  }
});

router.post('/', async (req, res) => {
  try {
    const nuevoClub = new Club(req.body);
    await nuevoClub.save();
    return res.status(201).json(nuevoClub);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: 'Error al crear club',
      detalles: error.message,
      code: error.code,
      fields: error.errors
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const actualizado = await Club.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!actualizado) return res.status(404).json({ error: 'Club no encontrado' });
    return res.status(200).json({
      mensaje: 'Club actualizado correctamente',
      clubActualizado: actualizado,
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(400).json({ error: 'Error al actualizar club', detalles: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Club.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Club no encontrado' });
    return res.status(200).json({
      mensaje: 'Club eliminado correctamente',
      clubEliminado: eliminado,
      timestamp: new Date()
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar el club' });
  }
});

module.exports = router;
