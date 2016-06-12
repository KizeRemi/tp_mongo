'use strict'

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("Connexion réussie");

  let Users = db.collection('users');
  let Songs = db.collection('songs');
  let listSongs = [];
  let nbrSongs = 0;
  let noteSongsUsers = [];
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
  /*** On créé la collection Note ***/
  db.createCollection(
    'notes',
    {
        'validator':{
        $and:[
          { username: { $type: "string" } },
          { notes: { $type: "int"} }
        ]
      }
    }
  );
  let Notes = db.collection('notes');
  
  Users.find({}).forEach(
    function(e) {
      /*** On choisit un nombre aléatoire de musiques favorites ***/
      let nbrSongs = Math.floor((Math.random() * 6)); 
      let tmp = [];
      /*** On va créer un tableau contenant des musiques aléatoires ***/
      for(let i=0; i<nbrSongs;i++){
        /*** On choisit un nombre aléatoire qui sera l'index de la musique ***/
        chosenSong = Math.floor((Math.random() * listSongs.length)+1);
        /*** On vérifie que le nombre n'a pas été choisit pour éviter les doublons ***/
        while(tmp.indexOf(chosenSong) > -1){
          chosenSong = Math.floor((Math.random() * listSongs.length)+1);
        }
        /*** On insère la musique dans le tableau ***/
        let chosenNote= Math.floor((Math.random() * 6)); 
        noteSongsUsers.push(listSongs[chosenSong]);
        tmp.push(chosenSong);
        /*** On insère la note dans la base ***/
        Notes.insert({ username: e.username, notes: chosenNote, song: listSongs[chosenSong]})
      }
      noteSongsUsers = [];
    }
  )

});