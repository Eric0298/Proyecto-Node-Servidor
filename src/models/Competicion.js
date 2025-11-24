const mongoose = require('mongoose');
const competicionSchema = new mongoose.Schema(
    {
    nombre: { type: String, required: true, trim: true },           
    tipo: {
      type: String,
      enum: ['LIGA', 'COPA', 'SUPERCOPA', 'INTERNACIONAL', 'AMISTOSA'],
      required: true
    },
    pais:{type: String, trim: true},
    organizador: { type: String, trim: true },                     
    temporada: {                                                     
      type: String,
      required: true,
      match: [/^\d{4}\/\d{4}$/, 'Formato de temporada inválido (usa YYYY/YYYY)']
    },
    edicion: { type: Number, min: 1 },                              
    fecha_inicio: { type: Date },
    fecha_fin: { type: Date },
    estado: {                                                        
      type: String,
      enum: ['PROGRAMADA', 'EN_CURSO', 'FINALIZADA'],
      default: 'PROGRAMADA'
    },
},
{
    timestamps: true,
    collection: 'competiciones'
}
);
competicionSchema.index(
   { nombre: 1, temporada: 1, pais: 1 },
  { unique: true, partialFilterExpression: { nombre: { $type: 'string' }, temporada: { $type: 'string' } } }
);

const Competicion = mongoose.model('Competicion', competicionSchema);
module.exports = Competicion;