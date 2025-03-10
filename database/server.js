/**
 * @file server.js
 * @description Uses express server to handle user login requests and connecting to mysql db running in cs vm
 * 
 * @dependencies
 * - express: handles HTTP requests for api - see: https://expressjs.com/en/5x/api.html
 * - mysql2: Mysql used to connect to db (using 2 because of auth issues in regular mysql)
 * 
 * @setup
 * - Connects to a MySQL database (`t15`).
 * - Provides a `/login` endpoint to fetch user login data
 * 
 * @routes
 * - GET /login: Gets username and password data based on "username" param
 *   - 400: if username is missing in query
 *   - 500: if there is a db related error
 *   - 404: if no record matching username is found
 *   - 200: if record is found
 * 
 * @author Angie Gorton
 */


const express = require("express");
const mysql = require('mysql2'); 
const dotenv = require('dotenv');

const app = express(); 

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });

//connection to t15 db - not secure so im putting all our secure info here
const db = mysql.createConnection({
    host: process.env.DB_HOST,        
    user: process.env.DB_USER,        
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, 
    port: process.env.DB_PORT 
});

//attempts connection to db
db.connect((error) => {
    if (error) {
      console.error('DB connection failed whomp whomp : ' + error.message);
      return;
    }
    console.log('Hell yeah we connected to mysql !!!');
  });

  //get request to server /login endpoint
  app.get("/login", (req, res) => {
    const { username } = req.query;  // get user_name from query params

    //400 - bad request
    if (!username) {
        return res.status(400).json({ error: "username is required in search" });
    }

    //sql command to pull back records that match username
    const sql = "SELECT * FROM user_login WHERE user_name = ?";
    db.query(sql, [username], (err, result) => {
        if (err) {
            //500 - internal server error
            return res.status(500).json({ error: "database error - error getting user data" });
        }
        
        if (result.length === 0) {
            //404 - not found
            return res.status(404).json({ message: "user with that username not found :(" });
        }

        res.json(result);
    });
});

app.listen(5657, () => {
    console.log("server running on port 5657");
});


module.exports = { app, db }; // export app so tests pass