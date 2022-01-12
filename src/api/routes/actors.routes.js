const express = require('express');
const router = express.Router();
const actorsSchema = require('../models/actors.model');

router.route('/actors').get((req, res) => {
    actorsSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
});

router.route('/actors/:id').delete(async(req, res, next) => {
    actorsSchema.findByIdAndRemove(req.params.id, (error) => {
        if (error) {
            return next(error);
        }
        res.status(200).json({
            message: 'Actor Deleted',
        })
    });
    
});

router.route('/actors/:id').put(async(req, res, next) => {
    actorsSchema.findByIdAndUpdate(req.params.id, (error) => {
        if (error) {
            return next(error);
        }
            res.status(200).json({
                message: 'Actors Updated',
            })
    });
    
});

router.post('/actors', (req, res, next) => {
    const actor = new actorsSchema({
        name: req.body.name,
        age: req.body.age,
        yearsActive: req.body.yearsActive,
    });
    actor.save().then((response) => {
        res.status(201).json({
            message: 'actor created 😎',
            result: response
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

module.exports = router;