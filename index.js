const express = require('express');
const mongoose = require('mongoose');        
require('dotenv').config();

const clubRoutes = require('./src/routes/rutaClubs');
const jugadorRoutes = require('./src/routes/rutaJugadores');
const competicionRoutes = require('./src/routes/rutaCompeticiones');
const clubCompeticionRoutes = require('./src/routes/rutaClubCompeticion');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/futbol';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log(' Error de conexión:', err));

app.use('/api/clubs', clubRoutes);
app.use('/api/jugadores', jugadorRoutes);
app.use('/api/competiciones', competicionRoutes);
app.use('/api/inscripciones', clubCompeticionRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
