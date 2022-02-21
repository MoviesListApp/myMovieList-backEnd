'use strict';
const express = require('express');
const cors = require('cors');
const app = express();
const pg = require('pg');
require('dotenv').config();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
const axios = require('axios');
const my_api = process.env.APIKEY;
const client = require('./Controller/movies.controller').client;

const getAllMovies = require('./Controller/movies.controller').getAllMovies;
const AddMovie = require('./Controller/movies.controller').AddMovie;
const deleteMovie = require('./Controller/movies.controller').deleteMovie;
const updateMovie = require('./Controller/movies.controller').updateMovie;
const getMovie = require('./Controller/movies.controller').getMovie;
const handleData = require('./Controller/movies.controller').handleData;
const handleSearch = require('./Controller/movies.controller').handleSearch;
const getMoviesDataBase = require('./Controller/movies.controller').getMoviesDataBase;
app.get('/', handleData);
app.get('/getAllTrendingMovies', getAllMovies);
app.post('/addMovie', AddMovie);
app.delete('/DELETE/:id', deleteMovie);
app.put('/UPDATE/:id', updateMovie);
app.get('/getMovie/:id', getMovie);
app.get('/search', handleSearch);
app.get('/getMoviesDataBase', getMoviesDataBase);

client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Start Running On ${PORT}`);
        });
    }).catch(console.error)