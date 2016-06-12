'use strict'

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("Connexion réussie");
  console.log("Affichage du top 10 des musiques");
  var Notes = db.collection('notes');
  
});