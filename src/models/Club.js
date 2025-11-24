const mongoose = require('mongoose');

let clubSchema = new mongoose.Schema({
    nombre: {type: String, required:true, trim: true ,index:true },
    fundacion: {type: Date},
    ciudad:{type: String, trim:true},
    pais:{type:String,trim:true},
    estadio:{type:String, trim:true},
    web:{type:String, trim: true},
    trofeos:{
        type:Map,
        of:Number,
        default:{}
    }},
    {
        timestamps: true, collection: 'clubs'
    });
    clubSchema.index({nombre: 1, ciudad:1, pais:1},{unique:true});

const Club = mongoose.model('Club', clubSchema);
module.exports=Club