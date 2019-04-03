'use strict';
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies');

const app = express();

app.use(morgan('dev'));

function handleGetMovie(req, res) {
  res.send(movies);
}

app.get('/movie', handleGetMovie);

app.listen(8000, () => {
  console.log('Express server is liistening on port 8000!');
});