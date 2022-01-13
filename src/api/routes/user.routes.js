const express = require('express');
const jwt = require(' JsonWebToken');
const bcrypt = require('bcrypt');
const router = express.router();
const authorize = require('../../utils/middlewares/auth');
const { check, validationResult } = require('express-validator');
const userSchema = require('../models/user.model');
const { restart } = require('nodemon');
const res = require('express/lib/response');
const { json } = require('body-parser');

router.post(
    '/register',
    [
        check('name')
            .not()
            .isEmpty()
            .isLength({ min: 3 })
            .withMessage( 'Name must be atleast 3 characters long'),
        check( 'email', 'Email is required')
            .not()
            .isEmpty(),
        check( 'password', 'Password is required')
            .not()
            .isEmpty()
            .isLength({ min: 5, max: 8 }),

    ],
    (req, res, next) => {
        const errors = validationResult(req),

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        } else {
            bcrypt.hash(req.body.password, 10).then((hash) => {
                const user = new userSchema({
                    name: req.body.mane,
                    email: req.body.email,
                    password: hash,
                    emoji: req.body.emoji
                });
                user.save().then((response) => {
                    res.status(201).json({
                        message: 'User successully created!',
                        result: response
                    });
                }).catch(error => {
                    res.status(500).json({
                        error:error
                    });
                });
            });
        }
    }
);

router.post(
    "/login",
    (req, res, next) => {
        let getUser;

        userSchema.findOne({
            email: req.body.email
        }).then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Autetnication failed'
                });
            }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if(!response) {
            return res.status(401).json({
                message: 'Autentication failed'
            });
        }
        let jwtToken = jwt.sign(
            {
                email: getUser.email,
                userId: getUser._id 
            },
            'longer-secret-is-beter',
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            token:jwtToken,
            expiresIn: 3600,
            _id: getUser._id
        });
    }).catch(err => {
        return res.status(401).json({
            message: 'Autentication failed'
        });
    });
});

router.route('/users').get((req, res) => {
    userSchema.find((error, response) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                 users: response
            })
        }
    })
});

router.route('/user/:id').get(authorize, (req, res, next) => {
    userSchema.findById(req.params.id, (error, response) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                 users: response
            })
        }
    })
});

router.route('/user/:id').put(async (req, res, next) => {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    console.log(req.body.password);
    userSchema.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
        } else {
            res.json(data);
            console.log('User successfully updated!')
        }
    })
});

router.route('/user/:id').delete((req, res, next) => {
    userSchema.findByIdAndRemove(req.params.id, (error, response) => {
        if (error) {
            return next(error);
        } else {
            res.status(200).json({
                message: 'User removed',
                user: response
            });
        }
    });
});

module.exports = router;
