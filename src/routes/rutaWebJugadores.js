const express = require('express');
const Jugador = require('../models/Jugador');
const Club = require('../models/Club');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const jugadores = await Jugador.find().populate('club');
    res.render('jugadores_listado.njk', { jugadores });
  } catch (error) {
    res.render('error.njk', { error: 'Error al cargar el listado de jugadores.' });
  }
});


router.get('/nuevo', async (req, res) => {
  try {
    const clubs = await Club.find().sort({ nombre: 1 });
    res.render('jugadores_nuevo.njk', { clubs });
  } catch (error) {
    res.render('error.njk', { error: 'Error al cargar el formulario de creación.' });
  }
});


router.post('/', async (req, res) => {
  try {
    const jugador = new Jugador({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      fecha_nacimiento: req.body.fecha_nacimiento,
      nacionalidad: req.body.nacionalidad,
      posicion: req.body.posicion,
      dorsal: req.body.dorsal,
      club: req.body.club,
      estadisticas: {
        goles: req.body.goles || 0,
        asistencias: req.body.asistencias || 0,
        partidos_jugados: req.body.partidos_jugados || 0
      }
    });

    await jugador.save();
    res.redirect('/jugadores');
  } catch (error) {
    res.render('error.njk', { error: 'Error al crear el jugador.' });
  }
});



router.get('/:id', async (req, res) => {
  try {
    const jugador = await Jugador.findById(req.params.id).populate('club');

    if (!jugador) {
      return res.render('error.njk', { error: 'Jugador no encontrado.' });
    }

    res.render('jugadores_detalle.njk', { jugador });
  } catch (error) {
    res.render('error.njk', { error: 'Error al cargar el detalle del jugador.' });
  }
});



router.get('/editar/:id', async (req, res) => {
  try {
    const jugador = await Jugador.findById(req.params.id).populate('club');
    const clubs = await Club.find().sort({ nombre: 1 });

    if (!jugador) {
      return res.render('error.njk', { error: 'Jugador no encontrado.' });
    }

    res.render('jugadores_editar.njk', { jugador, clubs });
  } catch (error) {
    res.render('error.njk', { error: 'Error al cargar el formulario de edición.' });
  }
});



router.put('/:id', async (req, res) => {
  try {
    const datosActualizados = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      fecha_nacimiento: req.body.fecha_nacimiento,
      nacionalidad: req.body.nacionalidad,
      posicion: req.body.posicion,
      dorsal: req.body.dorsal,
      club: req.body.club,
      estadisticas: {
        goles: req.body.goles,
        asistencias: req.body.asistencias,
        partidos_jugados: req.body.partidos_jugados
      }
    };

    await Jugador.findByIdAndUpdate(req.params.id, datosActualizados, { runValidators: true });
    res.redirect('/jugadores');
  } catch (error) {
    res.render('error.njk', { error: 'Error al modificar el jugador.' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    await Jugador.findByIdAndDelete(req.params.id);
    res.redirect('/jugadores');
  } catch (error) {
    res.render('error.njk', { error: 'Error al borrar el jugador.' });
  }
});

module.exports = router;
