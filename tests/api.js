var express = require('express')
var app = express()

app.get('/ping', function (req, res) {
  res.header('Expires', 0);
  res.send('pong')
})

app.post('/foo/bar', function (req, res) {
  res.send('bar')
});

app.post('/foo/baz', function (req, res) {
  res.send('baz')
});

app.listen(4000);
