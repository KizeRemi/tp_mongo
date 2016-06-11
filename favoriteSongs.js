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

/*** On créé un tableau contenant toutes les musiques ***/
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
      /*** On choisit un nombre aléatoire de musiques favorites ***/
      nbrFavoriteSongs = Math.floor((Math.random() * 11)); 
      let tmp = [];
      console.log(nbrFavoriteSongs);
      /*** On va créer un tableau contenant des musiques aléatoires ***/
      for(let i=0; i<nbrFavoriteSongs;i++){
        /*** On choisit un nombre aléatoire qui sera l'index de la musique ***/
        chosenSong = Math.floor((Math.random() * listSongs.length)+1);
        /*** On vérifie que le nombre n'a pas été choisit pour éviter les doublons ***/
        while(tmp.indexOf(chosenSong) > -1){
          chosenSong = Math.floor((Math.random() * listSongs.length)+1);
        }
        /*** On insère la musique dans le tableau ***/
        favoriteSongsUsers.push(listSongs[chosenSong]);
        tmp.push(chosenSong);
       
      }
      /*** On met à jour l'utilisateur avec le nouveau champ et sa liste de musique ***/
      Users.update({ username: e.username }, {$set:{ favoriteSongs: favoriteSongsUsers} })
      .catch(err => { console.log(err); })
      favoriteSongsUsers = [];
    }
  )
  console.log("Les utilisateurs ont été mis à jour avec leurs chansons favorites")
});