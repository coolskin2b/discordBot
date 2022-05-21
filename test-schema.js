const mongoose = require('mongoose');

var Schema = mongoose.Schema;

const TestSchema = new Schema({
    message:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model('testing', TestSchema);