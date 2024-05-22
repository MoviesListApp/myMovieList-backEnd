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


function Movies(name ,description ,family ,place_of_found ,specie ,habits ,diet ,weight ,height ,image) {
    this.name = name;
    this.description = description;
    this.family = family;
    this.place_of_found = place_of_found;
    this.specie = specie;
    this.habits = habits;
    this.diet = diet;
    this.weight = weight;
    this.height = height;
    this.image = image

}


const getAllMovies = (request, response) => {
    axios.get(`https://freetestapi.com/api/v1/animals`).then(data => {
        let mymovie = data.data.map((value) => {
            let newMovie = new Movies(value.name ,value.description ,value.family ,value.place_of_found ,value.specie ,value.habits ,value.diet ,value.weight ,value.height ,value.image);
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
    // console.log('====================================');
    // console.log(req);
    // console.log('====================================');
    let newMovie = [req.name ,req.description ,req.family ,req.place_of_found ,req.specie ,req.habits ,req.diet ,req.weight ,req.height ,req.image];
    let insertSql = `INSERT INTO myanimals(  name ,description ,family ,place_of_found ,specie ,habits ,diet ,weight ,height ,image ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
    client.query(insertSql, newMovie).then(data => {
        console.log(data);
        // response.json(data.rows);
        response.send("Hello")
    }).catch((error) => {
        // console.log('====================================');
        console.log(error);
        // console.log('====================================');
    });

}

const deleteMovie = ((request, response) => {
    const id = request.params.id;
    // console.log(id);
    let delSql = `DELETE FROM myanimals WHERE id = ${id};`;
    client.query(delSql).then(results => {
        console.log(results);
        return response.status(200).send(results.rows);
    }).catch((err) => {
        console.log(err);
    })
})

const updateMovie = ((request, response) => {
    const id = request.params.id;
    let comm = [request.body.immage];
    // console.log(id);
    // console.log(comm);
    let upSql = `UPDATE myanimals SET image = $1 WHERE id = ${id} RETURNING *;`;
    client.query(upSql, comm)
        .then(results => {
            // console.log(results.rows);
            response.status(200).send('your data has been updated successfully')
        })
        .catch(console.error)
})

const getMovie = ((request, response) => {
    const id = request.params.id;
    let sqlGetMyMovie = `SELECT * FROM myanimals WHERE id = ${id}`;
    client.query(sqlGetMyMovie).then(results => {
        response.send(results.rows);
    }).catch((err) => {
        console.log(err);
    })
})

const getMoviesDataBase = ((request, response) => {
    let sqlQuery = `SELECT * FROM myanimals;`;
    client.query(sqlQuery).then(results => {
        response.send(results.rows);
    }).catch((err)=> {
        console.log(err);
    })
})

const handleData = ((request, response) => {
    let movie = new Movies(data.name ,data.description ,data.family ,data.place_of_found ,data.specie ,data.habits ,data.diet ,data.weight ,data.height ,data.image);
    response.status(200).json(movie);
})

const handleSearch = ((request, response) => {
    let search = request.query.search;

   axios.get(`https://freetestapi.com/api/v1/animals&search=${search}`)
        .then(data => {
            response.send(data.data);
        }).catch((err) => {
            console.log(err);
        })
})
module.exports = { getAllMovies, deleteMovie, AddMovie, updateMovie, getMovie, handleData, handleSearch, getMoviesDataBase, client };