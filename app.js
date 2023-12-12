var express = require('express');
var app = express();
const bcrypt = require('bcrypt');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var mongoose = require('mongoose');
const url = "mongodb+srv://remy:123remy@cluster0.qeeekbp.mongodb.net/voiture?retryWrites=true&w=majority"
mongoose.connect(url)
    .then(console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

// Inscription

const User = require('./models/User');

app.get('/user/:id', function (req, res) {
    User.findOne({
      _id : req.params.id  
    })
    .then((data)=>{
        res.render('Modifier', {data: data})
    })
    .catch(err => console.log(err));
});


app.post('/api/Inscription', function (req, res) {
    if (req.body.password.length < 4) {
        return res.status(400).send('Password too short');
    }

    const Data = new User ({
        username : req.body.username,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10),
        nom : req.body.nom,
        prenom : req.body.prenom
    })

    Data.save()
    .then(() =>{
        console.log("User saved successfully");
        res.redirect("/login");
    })
    .catch(err =>{
        console.log(err);
    });
});

app.post('/api/Connexion', function(req, res){
    User.findOne({
        username : req.body.username,
    })
    .then(user => {
        if(!user){
            return res.status(404).send('No user found');
        }
        if(!bcrypt.compareSync(req.body.password, user.password)){
            return res.status(404).send ('Password incorrect')
        }
        res.render('MonCompte', {data: user});
    })
    .catch(err =>{
        console.log(err);
    });
});

// Update

app.get('/modify/:id', function(req, res){
    var user = User.findOne({
        _id : req.params.id
    })
    .then((data) =>{
        res.render('Modifier', {data: data});
    })
    .catch(err => console.log(err));
});

app.put('/modifier/:id', function(req, res){
    
    if (req.body.password.length < 4) {
        return res.status(400).send('Password too short');
    }

    const Data = {
        username : req.body.username,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10),
        nom : req.body.nom,
        prenom : req.body.prenom
    }

    User.updateOne({_id: req.params.id}, {$set: Data})
    .then(()=>{
        console.log('Data updated');
        res.redirect('/login');
    })
    .catch(err =>{
        console.log(err);
    });
});

// Delete

app.delete('/delete/:id', function(req, res){
    User.findOneAndDelete({
        _id: req.params.id
    })
    .then(()=>{
        console.log("Data deleted successfully");
        res.redirect('/signin');
    })
    .catch(err =>{
        console.log(err);
    });
});


app.get('/signin', function(req, res){
    res.render('Inscription');
});

app.get('/login', function(req, res){
    res.render('Connexion');
});

// Voitures
// Ajouter

var Cars = require('./models/Cars');

app.get('/home', function(req, res){
    Cars.find()
    .then(data =>{
        console.log(data);
        res.render('Accueil', {data: data})
    })
    .catch(err => console.log(err));
});

app.post('/api/Ajouter', function(req, res){
    const Data = new Cars({
        marque: req.body.marque,
        modele: req.body.modele,
        prix: req.body.prix,
        description: req.body.description
    })

    Data.save()
    .then(()=>{
        console.log('Cars saved successfully');
        res.redirect('/home');
    })
    .catch(err => console.log(err));
});

app.get('/addCars', function(req, res){
    res.render('Ajouter');
});

app.delete('/deletecars/:id', function(req, res){
    Cars.findOneAndDelete({
        _id: req.params.id
    })
    .then(()=>{
        console.log("Data deleted successfully");
        res.redirect('/home');
    })
    .catch(err =>{
        console.log(err);
    });
});


var server = app.listen(7070, function (req, res) {
    console.log("Server listening on port 7070");
});