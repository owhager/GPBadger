const express = require("express");
const mysql = require('mysql2');  // using mysql2 bc of auth issues in sql

const app = express();
app.use(express.json());

//connection to t15 db - variables found in .env file
//but this app isnt gonna be secure so im committing .env to git 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shoelace',
    database: 't15',
    port: 3306
});

db.connect((err) => {
    if (err) {
      console.error('DB connection failed L + bozo : ' + err.stack);
      return;
    }
    console.log('Hell yeah we connected to mysql !!! ');
  });

  app.get("/login", (req, res) => {
    const { username } = req.query;  // Get user_name from query params

    if (!username) {
        return res.status(400).json({ error: "username is required in search" });
    }

    const sql = "SELECT * FROM user_login WHERE user_name = ?";
    db.query(sql, [username], (err, result) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "database error" });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ message: "User with that username not found :(" });
        }

        res.json(result);
    });
});

app.listen(5657, () => {
    console.log("Server running on port 5657");
});