const express = require('express');
const router = express.Router();
const moviesSchema = require('../models/movies.model');

router.route('/movies').get(async(req, res) => {
    const movies = await moviesSchema.find().populate('actors');
    res.status(200).json(movies);
});

router.route('/movies/:id').delete(async(req, res,next) => {
    moviesSchema.findByIdRemove(req.params.id,(error) => {
        if (error) {
            return next(error);
        }

        res.status(200).json({
            message: 'Movie Deleted',
        });
    });
    
});

router.route('/movies/:id').put(async(req, res, next) => {
    moviesSchema.findByIdAndUpdate(req.params.id, (error) => {
        if (error) {
            return next(error);
        }

        res.status(200).json({
            message: 'Movie Updated',
        });
    });
    
});

router.post('/movies', (req, res, next) => {
    const movie = new moviesSchema({
        name: req.body.name,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date,
        actors: req.body.actors
    });
    movie.save().then((response) => {
        res.status(201).json({
            message: 'movie created 🎥!',
            result: response
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

module.exports = router;