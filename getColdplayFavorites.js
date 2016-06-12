'use strict'

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("Connexion Réussie");
  console.log("Liste des utilisateurs ayant au moins une chanson de Coldplay en favoris");

  var Users = db.collection('users');

  Users.find({favoriteSongs: { $elemMatch: {artist: "Coldplay"}}})
  .forEach(function(user){
      console.log(user.username);
  });
});