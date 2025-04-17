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
 * - POST /login: Creates a user record with email, password, first name, and last name params
 *   - 400: if email, password, first name, and last name params are missing in req body
 *   - 409: if a user with that email already exists
 *   - 500: if there is a db related error
 *   - 201: if record is created
 * 
 * - DELETE /login: Deletes a user record given a specified email
 *   - 400: if email param is missing in query
 *   - 500: if there is a db related error
 *   - 404: if no records are updated, meaning the user does not exist
 * 
 * - UPDATE /login: Updates a user record based on their email and either a new email, 
 *          new password, new first name, or new last name
 *   - 400: if email param is missing in query or if field for updated user trait is missing
 *   - 500: if there is a db related error
 *   - 404: if no records are updated, meaning the user does not exist
 * 
 * @author Angie Gorton
 */


const express = require("express");
const mysql = require('mysql2');

const app = express();
app.use(express.json());

//needed for auth when calling sever on port 9090 ig
const cors = require('cors');
app.use(cors());


//connection to t15 db - not secure so im putting all our secure info here
const db = mysql.createConnection({
    host: "localhost", //CHANGE TO "localhost" for local development BUT CHANGE BACK TO "mysql-container" BEFORE PUSHING TO MAIN
    user: 'root',
    password: 'shoelace',
    database: 't15',
    port: 3306
});


//attempts connection to db
db.connect((error) => {
    if (error) {
        console.error('DB connection failed whomp whomp : ' + error.message);
        return;
    }
    console.log('Hell yeah we connected to mysql !!!');
});

//GET request to server /login endpoint to get user info
app.get("/login", (req, res) => {
    const { email } = req.query;  // get email from query params

    //400 - bad request
    if (!email) {
        return res.status(400).json({ error: "email is required in search" });
    }

    //sql command to pull back records that match email
    const sql = "SELECT * FROM user_login WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err) {
            //500 - internal server error
            return res.status(500).json({ error: "database error - error getting user data!" });
        }

        if (result.length === 0) {
            //404 - not found
            return res.status(404).json({ message: "user with that email not found :(" });
        }

        res.json(result);
    });
});

// POST req to sign up new user
app.post("/login", (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // return 400 if all request params arents in post req
    if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "email, password, first name, and last name are required" });
    }

    // sql for inserting new user to db
    const sql = "INSERT INTO user_login (email, password, first_name, last_name) VALUES(?, ?, ?, ?)";

    db.query(sql, [email, password, firstName, lastName], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: " a user with that email already exists!" });
            }

            console.error("Database error:", err);
            return res.status(500).json({ error: "database error - error posting user data!" });
        }

        res.status(201).json({ message: "user successfully inserted to db!", iduser_login: result.insertId });
    });
});

// DELETE request to remove a user
app.delete("/login", (req, res) => {
    const { email } = req.query;

    // 400 - if email missing
    if (!email) {
        return res.status(400).json({ error: "email is required to delete an account" });
    }

    const sql = "DELETE FROM user_login WHERE email = ?";

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "database error - error deleting user!" });
        }

        // user doesnt exist if no rows affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "user not found - no deletion!" });
        }

        res.json({ message: "user successfully deleted!" });
    });
});


// PUT req that updates user info
app.put("/login", (req, res) => {
    const { email, newPassword, newEmail, newFirstName, newLastName } = req.body;

    // if no email is included in req
    if (!email) {
        return res.status(400).json({ error: "email is required to update user!" });
    }

    //if no update param is sent
    if (!newPassword && !newEmail && !newFirstName && !newLastName) {
        return res.status(400).json({ error: "please provide a user param field to update!" });
    }

    //update email column if newEmail included in request
    if (newEmail) {
        const sql = "UPDATE user_login SET email = ? WHERE email = ?";

        db.query(sql, [newEmail, email], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "database error - error updating email!" });
            }

            // if no rows updated then user never existed
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "user not found - nothing updated!" });
            }

            res.json({ message: "user email successfully updated!" });
        });

    }

    //update password column if newPassword included in request
    else if (newPassword) {
        const sql = "UPDATE user_login SET password = ? WHERE email = ?";

        db.query(sql, [newPassword, email], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "database error - error updating password!" });
            }

            // if no rows updated then user never existed
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "user not found - nothing updated!" });
            }

            res.json({ message: "user password successfully updated!" });
        });

    }

    //update first name column if newFirstName included in request
    else if (newFirstName) {
        const sql = "UPDATE user_login SET first_name = ? WHERE email = ?";

        db.query(sql, [newFirstName, email], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "database error - error updating first name!" });
            }

            // if no rows updated then user never existed
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "user not found - nothing updated!" });
            }

            res.json({ message: "user first name successfully updated!" });
        });
    }

    //update last name column if newLastName included in request
    else if (newLastName) {
        const sql = "UPDATE user_login SET last_name = ? WHERE email = ?";

        db.query(sql, [newLastName, email], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "database error - error updating last name!" });
            }

            // if no rows updated then user never existed
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "user not found - nothing updated!" });
            }

            res.json({ message: "user last name successfully updated!" });
        });

    }

});



app.listen(5657, () => {
    console.log("server running on port 5657");
});




module.exports = { app, db }; // export app so tests pass