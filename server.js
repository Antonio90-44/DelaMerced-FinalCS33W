/*
 * server.js
 * FINAL TERM - Movie recommendations
 * Antonio De la Merced
 * 12/09/2025
 */

const express = require("express");
const path = require("path");
const logger = require('./middleware/logger');
const sanitize = require('./middleware/sanitize');
require("./config/db"); 

const app = express();
const PORT = 3000;

//  MIDDLEWARE 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);
app.use(sanitize);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// ROUTES 

app.get("/", (req, res) => {
    res.redirect("/movies");
});

const movieRoutes = require("./routes/movies");
app.use("/movies", movieRoutes);

// About page
app.get('/about', (req, res) => {
    res.send(`
        <h1>About Final term</h1>
        <p>Created by: Antonio De la Merced</p>
        <p>Final Term: Fall 2025</p>
    `);
});


app.use((err, req, res, next) => {
    console.error("[ERROR] " + err.message);
    const status = err.status || 500;
    res.status(status).json({ issue: "Error: " + err.message });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
