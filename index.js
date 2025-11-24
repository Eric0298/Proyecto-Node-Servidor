require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

const rutaClubs = require('./src/routes/rutaClubs');
const rutaJugadores = require('./src/routes/rutaJugadores');
const rutaCompeticiones = require('./src/routes/rutaCompeticiones');
const rutaClubCompeticion = require('./src/routes/rutaClubCompeticion');
const rutaWebJugadores = require('./src/routes/rutaWebJugadores');

const app = express();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/futbol";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Conectado a MongoDB"))
  .catch(err => console.error("Error al conectar a MongoDB:", err));



app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use('/public', express.static(path.join(__dirname, 'public')));

// --------- Configuración Nunjucks ---------
const viewsPath = path.join(__dirname, 'src', 'views');

const env = nunjucks.configure(viewsPath, {
  autoescape: true,
  express: app
});

env.addFilter('date', function (value) {
  if (!value) return '';
  const d = new Date(value);
  return d.toISOString().slice(0, 10); 
});

app.set('view engine', 'njk');

app.use('/jugadores', rutaWebJugadores);

app.get('/', (req, res) => {
  res.redirect('/jugadores');
});


app.use('/api/clubs', rutaClubs);
app.use('/api/jugadores', rutaJugadores);
app.use('/api/competiciones', rutaCompeticiones);
app.use('/api/inscripciones', rutaClubCompeticion);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
