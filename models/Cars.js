const mongoose = require('mongoose');

const carsSchema = mongoose.Schema({
    marque : {type : String, required: true},
    modele : {type : String, required: true, unique: true},
    prix : {type : String, required: true},
    description : {type : String, required: true},
});

module.exports =mongoose.model('Cars', carsSchema);