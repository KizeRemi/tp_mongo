# TP Mongo - LPDW

## EXERCICE 1

### 1/ 
Vérifiez qu'aucun processus mongo tourne actuellement sur votre machine. Si c’est
le cas, arretezle.
Ensuite lancez une instance mongod avec le dbpath par défaut.
Connectezvous
sur le shell mongo et affichez le port utilisé et less infos du host
depuis le shell.

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
Lancez à nouveau une instance de mongod mais cette fois, modifiez le dbpath et le
fichier de sortie de logs. Connectez vous sur le shell et affichez les infos utilisées
pour la configuration du processus. Vérifiez aussi que les logs sont bien écrit dans le
fichier avec un tail f
ou un cat .

```
mongod dbpath instance/data/db port 27018
mongo 27018
```
### 4/
Faites l’import des données contenues dans le fichier zip donnée par l’enseignant
afin de construire une base de données appelé “music”.
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
db.songs.find().count()
```
### 3/
Affichez exclusivement les titres des chansons du Coldplay de l’album X&Y.
```
db.getCollection('songs').find({ album: "X&Y" },{title:1})
```
### 4/
Affichez le titre et album des chansons de Stromae, ordonnés par année de la plus
récente à la plus ancienne, et triés par ordre alphabétique par titre.
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
Affichez, une seule fois, le noms des artistes ayant produit des chansons entre 2002
et 2005.
```
db.getCollection('songs').distinct("artist", { $and:[ {year:{$gte:2002} },{ year:{$lte:2005} }  ] } )
```
### 7/
Créez une collection recordLabel, qui puisse stocker maximum 3 documents ou 1 KB
et dont la structure doit être : nom: string url: string
La validation doit être stricte. Cherchez les regex nécessaires pour les attributes.
```
db.createCollection("recordLabel", { capped: true, size: 1000, max:3, validator: {$and:[{nom:{$type: "string"} }, {url:{$regex: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/ } } ] } })
```
