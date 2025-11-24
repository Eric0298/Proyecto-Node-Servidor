const mongoose = require('mongoose');
const clubCompeticionSchema = new mongoose.Schema(
    {
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    competicion: { type: mongoose.Schema.Types.ObjectId, ref: 'Competicion', required: true },
    puntos: { type: Number, min: 0, default: 0 },
    posicion_final: { type: Number, min: 1 },
    partidos_jugados: { type: Number, min: 0, default: 0 },
    victorias: { type: Number, min: 0, default: 0 },
    empates: { type: Number, min: 0, default: 0 },
    derrotas: { type: Number, min: 0, default: 0 },
    goles_favor: { type: Number, min: 0, default: 0 },
    goles_contra: { type: Number, min: 0, default: 0 }
    },
    {
        timestamps: true,
        collection:'club_competiciones'
    }
);
clubCompeticionSchema.index({ club: 1, competicion: 1 }, { unique: true });
clubCompeticionSchema.index({ competicion: 1, puntos: -1, goles_favor: -1 });
const ClubCompeticion = mongoose.model('ClubCompeticion', clubCompeticionSchema);
module.exports = ClubCompeticion;