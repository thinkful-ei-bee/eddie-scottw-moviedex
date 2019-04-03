'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const movies = require('./movies');
const cors = require('cors');
const helmet = require('helmet');



const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

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
  const {genre, country, avg_vote}= req.query;

  let results = movies;

  if (genre !== undefined) {
    results = results.filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    )
  }
  if (country !== undefined) {
    results = results.filter(movie => 
      movie.country.toLowerCase().includes(country.toLowerCase())
    )
  }
  if (avg_vote !== undefined)  {
    if (isNaN(avg_vote) || parseFloat(avg_vote)<0 || parseFloat(avg_vote)>10) {
      return res.status(400).send('avg_vote must be a number between 0 and 10')
    }
    results = results.filter(movie => 
      movie.avg_vote >= parseFloat(avg_vote)
    )
  }


  res.send(results);
}

app.get('/movie', handleGetMovie);

app.listen(8000, () => {
  console.log('Express server is liistening on port 8000!');
});