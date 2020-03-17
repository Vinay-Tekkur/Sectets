//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  userEmail: String,
  userPassword:String
});


userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields:['userPassword']});

const User = mongoose.model("User", userSchema);
console.log(process.env.SECRET);
app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    userEmail: req.body.username,
    userPassword: req.body.password
  });

  newUser.save(function(){
    res.render("secrets");
  });
});

app.post("/login", function(req, res){
  User.findOne({userEmail:req.body.username},function(err, foundUser){
    if(foundUser){
      if(foundUser.userPassword === req.body.password){
        res.render("secrets");
      }
    }else{
      console.log("Invalid user!");
      res.render("home");
    }
  });
});

app.listen(3000, function(){
  console.log("Server started at port 3000");
});
