'use strict'

const faker = require('faker');
const MongoClient = require('mongodb').MongoClient;

/*** On créé un tableau contenant 1000 utilisateurs ***/
var listUsers = [];
for(let i=0; i<1000;i++){
	listUsers.push({
	    'username': faker.internet.userName(),
	    'displayname': faker.internet.userName(),
	    'email': faker.internet.exampleEmail()
	});
}


MongoClient.connect("mongodb://localhost:27017/music", function(err, db) {
  console.log("Connexion réussie");
  
  /*** On créé la collection Users et on insère les utilisateurs ***/
  db.createCollection(
    'users',
    {
    	'size' : 150000,
    	'max': 1000,
        'validator':{
        $and:[
          { username: { $type: "string" } },
          { displayname: { $type: "string" } },
          { email: { $regex: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i } }
        ]
      }
    }
  )
  .then(() => db.collection('users').insert(listUsers))
  .catch(err => { console.log(err); })
  .then(function(){
    db.close();
    console.log('La collection d\'utilisateurs a été créée')
  });
})
