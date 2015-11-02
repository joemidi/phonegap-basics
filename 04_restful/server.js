var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');

var app = express();
// RESTful APIs

function getDB() {
  return mongojs('restful', ['contacts']);
}

function errorHandler(res) {
  res.status(500).send('Database error.');
}

app.get('/contacts', function(req, res){
  console.log('GET Request');
  var db = getDB();
  db.contacts.find().sort({surname:1}, function(err, docs) {
    if (err) errorHandler(res)
      else res.json(docs);
  });
});

app.get('/contacts/:userID', function(req, res){
  console.log('GET Request '+req.params.userID);
  var db = getDB();
  db.contacts.find({_id: mongojs.ObjectId(req.params.userID)}, function(err, docs) {
    if (err) errorHandler(res)
      else res.json(docs);
  });
});

// read the request body in URL Variables or JSON
app.use('/contacts', bodyParser.urlencoded({ extended: false }));
app.use('/contacts', bodyParser.json());

app.post('/contacts', function(req, res){
  console.log('POST Request');
  var db = getDB();
  db.contacts.insert(req.body, function(err) {
    if (err) errorHandler(res)
      else res.end();
  });
});

// Route to public folder
app.use( express.static('./ContactsApp/www') );

app.use('*', function(req, res) {
  res.status(404);
  res.send('<h1>Server Error 404</h1><p>File not found</p>');
});

app.listen(3000, function() {
  console.log('Server running on http://localhost:3000');
});