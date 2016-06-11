'use strict'

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("Connexion réussie");
  let Users = db.collection('users');
  let Songs = db.collection('songs');
  let listSongs = [];
  let nbrFavoriteSongs = 0;
  let favoriteSongsUsers = [];
  let chosenSong = 0;

  Songs.find({}, {title:1, artist:1}).forEach(
    function(e) {
      listSongs.push({
        'title': e.title,
        'artist': e.artist
      })
    }
  );
  Users.find({}).forEach(
    function(e) {
      nbrFavoriteSongs = Math.floor((Math.random() * 10)+1); 
      let tmp = [];
      for(let i=0; i<nbrFavoriteSongs;i++){

        chosenSong = Math.floor((Math.random() * listSongs.length)+1);
        while(tmp.indexOf(chosenSong) > -1){
          
          chosenSong = Math.floor((Math.random() * listSongs.length)+1);
        }
        favoriteSongsUsers.push(listSongs[chosenSong]);
        tmp.push(chosenSong);
      }
      Users.update({ username: e.username }, {$set:{ favoriteSongs: favoriteSongsUsers} })
      .catch(err => { console.log(err); })
      favoriteSongsUsers = [];
    }
  )
});