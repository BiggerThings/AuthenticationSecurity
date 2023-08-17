//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const SHA256 = require('crypto-js/sha256');

const app = express();

console.log(SHA256('1234asdf').toString());

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model('User', userSchema);

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: SHA256(req.body.password).toString()
    });

    newUser.save()
    .then(() => {
        res.render('secrets');
    })
    .catch((err) => {
        console.log(err);
    })
});

app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = SHA256(req.body.password).toString();

    User.findOne({ email: username})
    .then((foundUser) => {
        if (foundUser.password === password) {
            res.render('secrets');
        }
    })
    .catch((err) => {
        console.log(err);
    })
});



app.listen(3000, function () {
    console.log('Server started on port 3000'); 
});