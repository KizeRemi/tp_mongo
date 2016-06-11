'use strict'

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("Connexion réussie");
  console.log("Affichage des utilisateurs qui n'ont pas de chansons favorites");
  let Users = db.collection('users');

  Users.find({favoriteSongs: {$size: 0}})
  .forEach(function(user){
      console.log(user.username);
  });
});