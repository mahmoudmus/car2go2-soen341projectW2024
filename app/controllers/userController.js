const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

exports.signUp = asyncHandler(async (req, res, next) => {
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
        const savedUser = await user.save();
        const token = jwt.sign(
            { id: savedUser._id },
            process.env.USER_AUTH_JWT_SECRET,
            {
                expiresIn: '12h',
            }
        );

        // Set HttpOnly cookie @duplicated
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false, // Set to true in production
            maxAge: 3600000,
            sameSite: 'strict',
            path: '/',
        });
        res.redirect('/');
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

exports.createUser = asyncHandler(async (req, res, next) => {
    const { name, email, age, address, type, hash } = req.body;
    console.log({ name, email, age, address, hash });
    if (age < 18) {
        return res.status(400).json({
            message: 'Users must be atleast 18 years of age.',
        });
    }
    const user = new User({
        name,
        email,
        age,
        address,
        type,
        hash,
    });

    try {
        const savedUser = await user.save();
        res.render('user/row', { user: savedUser, layout: false });
    } catch (error) {
        switch (error.code) {
            case 11000: // Duplicate key error
                res.status(400).json({
                    message: 'This email is already in use.',
                });
                break;
            default:
                res.status(500).json({
                    message: 'Server error.',
                });
        }
    }
});

exports.readAllUsers = asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.type !== 'admin') {
        res.render('user/login', {
            error: 'This page is restricted.',
        });
    } else {
        const allUsers = await User.find({}, 'name email age address type');
        res.render('user/list', { userList: allUsers });
    }
});

exports.readUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.json({ user });
});

exports.readProfile = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
    } else {
        res.render('user/profile', { user: req.user });
    }
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (req.user && req.user.email === user.email) {
        const { name, age, email, address } = req.body;
        user.name = name;
        user.age = age;
        user.email = email;
        user.address = address;
        const savedUser = await user.save();

        res.redirect('/profile');
    } else {
        return res.render('user/profile', {
            user,
            error: 'You need to be signed it to modify this information',
        });
    }
});

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (req.user && req.user.type === 'admin') {
        const { name, age, email, address, type, hash } = req.body;
        user.name = name;
        user.age = age;
        user.email = email;
        user.address = address;
        user.type = type;

        if (hash) {
            user.hash = hash;
        }

        const updatedUser = await user.save();
        res.status(200).json({ updatedUser });
    } else {
        res.status(401).json({ message: 'You do not have admin privileges.' });
    }
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const result = await User.findByIdAndDelete(id);
    if (!result) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
});
