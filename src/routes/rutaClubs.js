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


router.get('/pais/:pais', async (req, res) => {
  try {
    const clubs = await Club.find({ pais: req.params.pais });
    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener clubes por país' });
  }
});

router.get('/ciudad/:ciudad', async (req, res) => {
  try {
    const clubs = await Club.find({ ciudad: req.params.ciudad });
    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener clubes por ciudad' });
  }
});

router.get('/buscar-nombre/:texto', async (req, res) => {
  try {
    const regex = new RegExp(req.params.texto, 'i'); 
    const clubs = await Club.find({ nombre: regex });
    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar clubes por nombre' });
  }
});

router.get('/fundacion/:min/:max', async (req, res) => {
  try {
    const min = Number(req.params.min);
    const max = Number(req.params.max);

    const clubs = await Club.find({
      fundacion: { $gte: min, $lte: max }
    });

    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener clubes por rango de fundación' });
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

router.post('/', async (req, res) => {
  try {
    const club = new Club(req.body);
    const guardado = await club.save();
    return res.status(201).json(guardado);
  } catch (error) {
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
    return res.status(200).json(actualizado);
  } catch (error) {
    return res.status(400).json({
      error: 'Error al actualizar club',
      detalles: error.message
    });
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
