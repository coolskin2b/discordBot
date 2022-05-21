const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const BossSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    // location : Dongeon
    location:{
        type:String,
        required:true
    },
    // Temps de respawn mini : 12h
    respawnmax:{
        type:Number,
        required:true
    },
        // Temps de respawn mini : 24h
    respawnmini:{
        type:Number,
        required:true
    },
    // nombre de fois trouvé vivant
    nbvivant:{
        type:Number,
        required:false
    },
    // nombre de fois trouvé mort
    nbmort:{
        type:Number,
        required:false
    },
    image:{
        type:String,
        required:false
    }
});

module.exports = mongoose.model('Boss', BossSchema, 'boss');

