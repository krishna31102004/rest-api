const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('../models/product'); // Assuming a product model exists

exports.user_signup = (req, res) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'Mail exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.user_login = (req, res) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if (result) {  
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                );  
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Auth failed'
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

exports.user_delete = (req, res) => {
    User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
};

// New function to get the profile information
exports.getProfile = (req, res) => {
    const userId = req.userData.userId; // Retrieved from the token via checkAuth middleware
    User.findById(userId)
    .select('email') // Only select the email field
    .exec()
    .then(user => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ email: user.email });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
};

exports.updatePassword = (req, res) => {
    const userId = req.userData.userId; // Retrieved from the token via checkAuth middleware
    const { password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        User.updateOne({ _id: userId }, { $set: { password: hash } })
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Password updated successfully'
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
    });
};







