'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies');



const app = express();

app.use(morgan('dev'));

function handleValidation(req, res, next) {
  const key = process.env.API_TOKEN;
  const userKey = req.get('Authorization');

  if (!userKey) {
    return res.status(401).json({error: 'Unauthorized access, no API key'});
  }
  if (userKey !== `Bearer ${key}`) {
    return res.status(401).json({error: 'Unauthorized access, incorrect API key'});
  }

  next();
}

app.use(handleValidation);

function handleGetMovie(req, res) {
  res.send(movies);
}

app.get('/movie', handleGetMovie);

app.listen(8000, () => {
  console.log('Express server is liistening on port 8000!');
});