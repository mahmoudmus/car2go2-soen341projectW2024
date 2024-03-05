const asyncHandler = require('express-async-handler');
// @todo remove these dependencies
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/user');

exports.authenticate = asyncHandler(async (req, res, next) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'] ?? null;
    }
    jwt.verify(
        token,
        process.env.USER_AUTH_JWT_SECRET,
        async (err, decoded) => {
            if (err) {
                req.user = false;
            } else {
                req.user = await User.findById(decoded.id);
            }
            res.locals.user = req.user;
            next();
        }
    );
});

exports.login = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.render('user/login', { error: 'Invalid email.' });
    } else if (!user.verifyPassword(req.body.hash)) {
        return res.render('user/login', { error: 'Invalid password.' });
    }

    // Issue JWT token
    const token = jwt.sign({ id: user._id }, process.env.USER_AUTH_JWT_SECRET, {
        expiresIn: '12h',
    });

    // Set HttpOnly cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: false, // Set to true in production
        maxAge: 3600000,
        sameSite: 'strict',
        path: '/',
    });
    res.redirect(`/users/${user._id}`);
});

exports.visitSignup = asyncHandler(async (req, res, next) => {
    res.render('user/signup');
});
