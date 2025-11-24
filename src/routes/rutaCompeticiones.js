const express= require('express');
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

router.get('/:id', async (req, res) => {
  try {
    const competicion = await Competicion.findById(req.params.id);
    if (!competicion) return res.status(404).json({ error: 'Competición no encontrada' });
    return res.status(200).json(competicion);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener competición' });
  }
});

router.get('/tipo/:tipo', async (req, res) => {
  try {
    const comps = await Competicion.find({ tipo: req.params.tipo });
    return res.status(200).json(comps);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por tipo' });
  }
});

router.get('/pais/:pais', async (req, res) => {
  try {
    const comps = await Competicion.find({ pais: req.params.pais });
    return res.status(200).json(comps);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por país' });
  }
});

router.get('/nombre/:nombre/temporada/:temporada', async (req, res) => {
  try {
    const { nombre, temporada } = req.params;
    const comp = await Competicion.findOne({ nombre, temporada });
    if (!comp) return res.status(404).json({ error: 'Competición no encontrada' });
    return res.status(200).json(comp);
  } catch (error) {
    return res.status(500).json({ error: 'Error al buscar por nombre y temporada' });
  }
});

router.get('/edicion/:min/:max', async (req, res) => {
  try {
    const min = Number(req.params.min);
    const max = Number(req.params.max);
    const comps = await Competicion.find({ edicion: { $gte: min, $lte: max } });
    return res.status(200).json(comps);
  } catch (error) {
    return res.status(500).json({ error: 'Error al filtrar por edición' });
  }
});

router.get('/buscar-nombre/:texto', async (req, res) => {
  try {
    const texto = req.params.texto;
    const comps = await Competicion.find({ nombre: { $regex: texto, $options: 'i' } });
    return res.status(200).json(comps);
  } catch (error) {
    return res.status(500).json({ error: 'Error en búsqueda por nombre' });
  }
});

router.put('/:id', async (req, res)=>{
    try {
        const actualizado = await Competicion.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true, runValidators:true}
        );
        if(!actualizado)return res.status(404).json({error:'Competicion no encontrada'});
        res.status(200).json({ 
            mensaje: 'Competicion actualizada correctamente',
            competicionActualizada:actualizado,
            timestamp: new Date()
        }
        );
    } catch (error) {
        res.status(400).json({error: 'Error al actualizar competicion', detalles:error.message});
    }
})

router.post('/', async (req, res) => {
  try {
    const nuevaCompeticion = new Competicion(req.body);
    await nuevaCompeticion.save();
    return res.status(201).json(nuevaCompeticion);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      error: 'Error al crear la competición',
      detalles: error.message,
      code: error.code,
      fields: error.errors
    });
  }
});
router.delete('/:id', async(req, res)=>{
    try {
        const eliminado = await Competicion.findByIdAndDelete(req.params.id);
        if(!eliminado) return res.status(404).json({error: 'Competición no encontrada'});
        res.status(200).json({
            mensaje:'Competicion eliminada correctamente',
            competicionEliminada: eliminado,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({error: 'Error al eliminar competición'})
    }
})
module.exports = router; 