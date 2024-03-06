const User = require('../models/user');
const asyncHandler = require('express-async-handler');

exports.createUser = asyncHandler(async (req, res, next) => {
    const { name, email, age, address, hash } = req.body;
    if (age < 18) {
        return res.render('user/signup', {
            error: 'You must be atleast 18 years of age to sign up.',
        });
    }
    const user = new User({
        name,
        email,
        age,
        address,
        hash,
    });

    try {
        await user.save();
        res.render('index');
    } catch (error) {
        switch (error.code) {
            case 11000: // Duplicate key error
                res.render('user/signup', {
                    error: 'Email already in use. Please use a different email address.',
                });
                break;
            default:
                res.render('user/signup', { error: error.message });
        }
    }
});

exports.readAllUsers = asyncHandler(async (req, res, next) => {
    const allUsers = await User.find({}, 'user_name');
    res.render('user_list', { user_list: allUsers });
});

exports.readUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.render('user/profile', { user });
});

exports.readProfile = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
    } else {
        res.render('user/profile', { user: req.user });
    }
});

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (req.user && req.user.email === user.email) {
        res.sendStatus(200);
    } else {
        return res.sendStatus(401);
    }
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    // @todo
    res.sendStatus(404);
});
