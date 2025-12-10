/*
Movie.js
Antonio De la Merced
12/09/2025
*/
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Movie = require("../models/movie");


router.get("/", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render("index", { title: "CineMerc - Movie Recommendations 2025", movies });
    } catch (err) {
        res.status(500).send("Database error: unable to fetch movies");
    }
});


router.get("/add", (req, res) => {
    res.render("addMovie", { title: "Add Movie", errors: [] });
});

router.post("/add",
    body("title").notEmpty().withMessage("Title is required."),
    body("genre").notEmpty().withMessage("Genre is required."),
    body("director").notEmpty().withMessage("Director is required."),
    body("duration").isInt({ min: 1 }).withMessage("Duration must be a number."),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("addMovie", { title: "Add Movie", errors: errors.array() });
        }
        await Movie.create(req.body);
        res.redirect("/movies");
    }
);

// Edit movie
router.get("/edit/:id", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.render("editMovie", { title: "Edit Movie", movie, errors: [] });
    } catch (err) {
        res.status(500).send("Database error: unable to fetch movie");
    }
});

router.post("/edit/:id",
    body("title").notEmpty().withMessage("Title is required."),
    body("genre").notEmpty().withMessage("Genre is required."),
    body("director").notEmpty().withMessage("Director is required."),
    body("duration").isInt({ min: 1 }).withMessage("Duration must be a number."),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const movie = await Movie.findById(req.params.id);
            return res.render("editMovie", { title: "Edit Movie", movie, errors: errors.array() });
        }
        await Movie.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/movies");
    }
);

// Delete movie
router.get("/delete", async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render("deleteMovie", { title: "Delete Movie", movies, errors: [] });
    } catch (err) {
        res.status(500).send("Database error: unable to delete");
    }
});

router.post("/delete",
    body("movieId").notEmpty().withMessage("You must select a movie."),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const movies = await Movie.find();
            return res.render("deleteMovie", { title: "Delete Movie", movies, errors: errors.array() });
        }
        await Movie.findByIdAndDelete(req.body.movieId);
        res.redirect("/movies");
    }
);

// Routes

// Search by title
router.get("/search/title", async (req, res) => {
    const q = req.query.q;
    if (!q) return res.redirect("/movies"); 

    const movies = await Movie.find({ $text: { $search: q } });
    res.render("index", { title: `Search Results for "${q}"`, movies });
});

// Search by genre
router.get("/search/genre", async (req, res) => {
    const q = req.query.q;
    if (!q) return res.redirect("/movies");

    const movies = await Movie.find({ genre: { $regex: q, $options: "i" } });
    res.render("index", { title: `Search by Genre: "${q}"`, movies });
});

// Search by director
router.get("/search/director", async (req, res) => {
    const q = req.query.q;
    if (!q) return res.redirect("/movies");

    const movies = await Movie.find({ director: { $regex: q, $options: "i" } });
    res.render("index", { title: `Search by Director: "${q}"`, movies });
});

router.get("/search/longmovies", async (req, res) => {
    const movies = await Movie.find({ duration: { $gt: 120 } });
    res.render("index", { title: 'Movies Longer than 120 Minutes', movies });
});

module.exports = router;
