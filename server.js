'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;



// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }))
// Specify a directory for static resources
app.use(express.static('./public/'))
// define our method-override reference
app.use(methodOverride('_method'))
// Set the view engine for server-side templating
app.set('view engine', 'ejs')
// Use app cors
app.use(cors())


// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/' , indexHandler)
app.post('/' , indexPostHandler)
app.get('/favorite-quotes' , myDataHandler)
app.get('/favorite-quotes/:quote_id' , myDataDetailsHandler)
app.put('/favorite-quotes/:quote_id' , myDataDetailsPutHandler)
app.delete('/favorite-quotes/:quote_id' , myDataDetailsDeleteHandler)


// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function indexHandler(req, res) {
let url = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=10'
superagent.get(url).set('User-Agent', '1.0').then( result => {
    res.render('index', {char: result.body})
})
}
function indexPostHandler( req,res){
    console.log(req);
const { name,quote,image,direction} = req.body;
let SQL = 'INSERT INTO chara (name,quote,image,direction) VALUES($1, $2, $3, $4)';
let val = [name,quote,image,direction];
client.query(SQL,val).then(result => {
    res.redirect('/favorite-quotes')
})
}
function myDataHandler(req, res){
let SQL = 'SELECT * FROM chara'
client.query(SQL).then( result => {
    res.render('mydata', {myData: result.rows})
})
}
function myDataDetailsHandler(req, res){
 let id = req.params.quote_id;
 let SQL = 'SELECT * FROM chara WHERE id=$1'
 client.query(SQL, [id]).then( result => {
     res.render('details', {details: result.rows[0]})
 })
}
function myDataDetailsPutHandler(req, res){
    let id = req.params.quote_id;
    let SQL = 'UPDATE chara SET quote=$1 WHERE id=$2'
    let val = [req.body.quote, id]
    client.query(SQL,val).then( result => {
        res.redirect(`/favorite-quotes/${id}`)
    })
}
function myDataDetailsDeleteHandler(req, res){
    let id = req.params.quote_id;
    let SQL = 'DELETE FROM chara WHERE id=$1'
    client.query(SQL,[id]).then( result => {
        res.redirect(`/favorite-quotes`)
    })
}

// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
