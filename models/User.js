const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username : {type : String, required: true, unique: true},
    email : {type : String, required: true, unique: true},
    password : {type : String, required: true, unique: true, min: 4, max: 20},
    nom : {type : String, required: true},
    prenom : {type : String, required: true},
    admin : {type : Boolean, default: false},
    superAdmin : {type : Boolean, default: false}
});

module.exports = mongoose.model('User', userSchema);