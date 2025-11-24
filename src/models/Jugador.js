const mongoose = require('mongoose');
let jugadorSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true , minlength: 1, index: true },
    apellido: { type: String, required: true, trim: true },
    fecha_nacimiento: { type: Date, required: true },
    nacionalidad: { type: String, trim: true },
    posicion: {
      type: String,
      enum: ['POR', 'DEF', 'MED', 'DEL', 'LATERAL', 'CENTRAL', 'MCO', 'MCD', 'EXT'],
      required: true},
    dorsal:{ type: Number, min: 1, max: 99 },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    lesionado: { type: Boolean, default: false },
    fecha_fichaje: { type: Date },
    duracion_contrato: { type: Number, min: 0 },
    goles: { type: Number, default: 0 },
    asistencias: { type: Number, default: 0 },
    partidos_jugados: { type: Number, default: 0 },
    foto: { type: String, trim: true }
},
{
    timestamps: true, collection: 'jugadores' 
}
);
jugadorSchema.index({ club: 1, dorsal: 1 }, { unique: true });

const Jugador = mongoose.model('Jugador', jugadorSchema);
module.exports = Jugador;
