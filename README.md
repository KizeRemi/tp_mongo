# TP Mongo - LPDW

## EXERCICE 1

### 1/ 
Vérifiez qu'aucun processus mongo tourne actuellement sur votre machine. Si c’est le cas, arretezle. Ensuite lancez une instance mongod avec le dbpath par défaut. Connectezvous sur le shell mongo et affichez le port utilisé et less infos du host depuis le shell.
```
mongod
mongo
myPort()
db.hostInfo()
```
### 2/ 
Arretez le processus depuis le shell.

```
db.shutdownServer()
```
### 3/
Lancez à nouveau une instance de mongod mais cette fois, modifiez le dbpath et le fichier de sortie de logs. Connectez vous sur le shell et affichez les infos utilisées pour la configuration du processus. Vérifiez aussi que les logs sont bien écrit dans le fichier avec un tail f ou un cat .
```
mongod dbpath instance/data/db port 27018
mongo 27018
```
### 4/
Faites l’import des données contenues dans le fichier zip donnée par l’enseignant afin de construire une base de données appelé “music”.
```
mongorestore --db=music --port 27018 --drop mymusic
```
## EXERCICE 2

### 1/
Affichez les documents de la collection songs.
```
use <database name>
db.getCollection('songs').find()
```
### 2/
Comptez le nombre de documents existants dans la collection songs.
```
db.songs.count()
```
### 3/
Affichez exclusivement les titres des chansons du Coldplay de l’album X&Y.
```
db.getCollection('songs').find({ album: "X&Y" },{title:1})
```
### 4/
Affichez le titre et album des chansons de Stromae, ordonnés par année de la plus récente à la plus ancienne, et triés par ordre alphabétique par titre.
```
db.getCollection('songs').find({ artist: "Stromae" },{title:1, album:1, year:1}).sort({year:-1, title:1})
```
### 5/
Affichez les chansons du group Coldplay dans un tableau, où les éléments sont des
strings ayant comme format TITRE (ALBUM).
```
db.getCollection('songs').find({ artist: "Coldplay" }).map(function(song){ return song.title+"("+song.album+")"})
```
### 6/
Affichez, une seule fois, le noms des artistes ayant produit des chansons entre 2002 et 2005.
```
db.getCollection('songs').distinct("artist", { $and:[ {year:{$gte:2002} },{ year:{$lte:2005} }  ] } )
```
### 7/
Créez une collection recordLabel, qui puisse stocker maximum 3 documents ou 1 KB et dont la structure doit être : nom: string url: string
La validation doit être stricte. Cherchez les regex nécessaires pour les attributes.
```
db.createCollection("recordLabel", { capped: true, size: 1000, max:3, validator: {$and:[{nom:{$type: "string"} }, {url:{$regex: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ } } ] } })
```
### 8/
Insérez les 3 registres dans la collection. Qu’estce qui se passe lorsque vous essayez insérer un 4ème ?
```
db.recordLabel.insert([{ nom: “First”, url: “www.first.com” },{ nom: “Second”, url: “www.second.com” },{ nom: “Third”, url: “www.third.com” }])
Lors de la 4eme insertion, il écrase la valeur la plus ancienne.
```
### 9/
Modifiez le validator sur la collection afin d’ajouter le pays en utilisant le code ( ISO 31661 alpha2)
```
db.runCommand({ collMod: "recordLabel", validator: {$or: [{nom:{$type: "string"} }, {url:{$regex: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ } }, {country:{ $regex: /^(AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)$/} } ] }})
```
### 9/ 
Pour allez plus loin:
a. Qu’est-ce que le TTL ?
``` 
TTL : Time To Live
Il s'agit d'une option qui permet supprimer définitivement l'élement d'une collection après une certaine durée en seconde ou une date précise.
```
b. Quelles sont les modifications à faire sur une collection pour rajouter du TTL ?
```
Il faut rajouter un champ sur une collection qui serait une date. On créé alors un index sur le champ en question avec une date d'expiration.
```
c. Si vous devez faire cette manipulation sur la collection recordLabel, il faudrait faire quoi exactement ?
```
db.recordLabel.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 } )
db.recordLabel.insert({createdAt: new Date(),  nom:"testTTL", url: "urlTTL" })
```
d. Créez une nouvelle collection recordLabel2, avec le même validator, mais avec une TTL sur les documents de 10 secondes.

## EXERCICE 4
Considérez les conceptes de CV et Personne. Comment peut on représenter ces
deux concepts avec un Embbeded Design ?
```
Avec un Embbeded Design, les 2 concepts CV et Personnes seraient dans le même document. Exemple
user: {
	_id:  < objectId1 >
	nom: "Mavillaz"
	prenom: "Remi"
	telephone: "0600000000"
	adresse: "15, town street"
	ville: "Townsville"
	cv:{
		titre: "Developpeur Web"
		competence: "description de la competence"
		dernier diplome: "Licence pro"
	}
}

Le problème de ce type de design est la duplication des données.
```

Comment le faire avec le Separated Collection Design ?
```
Avec un Separated Design, les 2 concepts CV et Personnes seraient 2 documents différents. Exemple
user:{
	_id: < objectId1 >
	nom: "Mavillaz"
	prenom: "Remi"
	telephone: "0600000000"
	adresse: "15, town street"
	ville: "Townsville"
	id_cv: < objectId3 >
}
cv:{
	_id: < objectId3 >
	titre: "Developpeur Web"
	competence: "description de la competence"
	dernier diplome: "Licence pro"
	id_user: < objectId1 >
}
