const express = require('express');
const cors = require('cors');
const app = express();
const pg = require('pg');
require('dotenv').config();
const data = require('../Data/data.json');
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
const axios = require('axios');
const { request, response } = require('express');
const my_api = process.env.APIKEY;

// const { request, response } = require("express");
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})


function Movies(title, poster_path, overview, release_dates, comment) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
    this.release_dates = release_dates;
    this.comment = comment;

}


const getAllMovies = (request, response) => {
    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${my_api}&language=en-US`).then(data => {
        let mymovie = data.data.results.map((value) => {
            let newMovie = new Movies(value.title, value.poster_path, value.overview, value.overview, value.release_dates, value.comment);
            return newMovie;
        });
        // console.log(mymovie);
        response.send(mymovie);
    }).catch((err) => {
        console.log(err);
        response.send(err);
    })
}

const AddMovie = (request, response) => {
    let req = request.body;
    console.log('====================================');
    console.log(req);
    console.log('====================================');
    let newMovie = [req.title, req.poster_path, req.overview, req.release_dates, req.comment];
    let insertSql = `INSERT INTO mymovies(title,  poster_path, overview, release_dates, comment) VALUES($1, $2, $3, $4, $5);`;
    client.query(insertSql, newMovie).then(data => {
        console.log(data);
        // response.json(data.rows);
        response.send("Hello")
    }).catch((error) => {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    });

}

const deleteMovie = ((request, response) => {
    const id = request.params.id;
    console.log(id);
    let delSql = `DELETE FROM myMovies WHERE id = ${id};`;
    client.query(delSql).then(results => {
        console.log(results);
        return response.status(200).send(results.rows);
    }).catch((err) => {
        console.log(err);
    })
})

const updateMovie = ((request, response) => {
    const id = request.params.id;
    let comm = [request.body.comment];
    console.log(id);
    console.log(comm);
    let upSql = `UPDATE myMovies SET comment = $1 WHERE id = ${id} RETURNING *;`;
    client.query(upSql, comm)
        .then(results => {
            console.log(results.rows);
            response.status(200).send('your data has been updated successfully')
        })
        .catch(console.error)
})

const getMovie = ((request, response) => {
    const id = request.params.id;
    let sqlGetMyMovie = `SELECT * FROM myMovies WHERE id = ${id}`;
    client.query(sqlGetMyMovie).then(results => {
        response.send(results.rows);
    }).catch((err) => {
        console.log(err);
    })
})

const getMoviesDataBase = ((request, response) => {
    let sqlQuery = `SELECT * FROM myMovies;`;
    client.query(sqlQuery).then(results => {
        response.send(results.rows);
    }).catch((err)=> {
        console.log(err);
    })
})

const handleData = ((request, response) => {
    let movie = new Movies(data.title, data.poster_path, data.overview, data.release_dates);
    response.status(200).json(movie);
})

const handleSearch = ((request, response) => {
    let search = request.query.query;

    axios.get(`https://api.themoviedb.org/3/search/company?api_key=${my_api}&query=${search}&page=1`)
        .then(data => {
            response.send(data.data);
        }).catch((err) => {
            console.log(err);
        })
})
module.exports = { getAllMovies, deleteMovie, AddMovie, updateMovie, getMovie, handleData, handleSearch, getMoviesDataBase, client };