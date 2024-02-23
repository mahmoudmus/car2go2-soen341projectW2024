const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models/user');

const opts = {
    jwtFromRequest: function (req) {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies['jwt'];
        }
        return token;
    },
    secretOrKey: process.env.USER_AUTH_JWT_SECRET,
};

exports.strategy = function (passport) {
    passport.use(
        new JwtStrategy(opts, async function (jwt_payload, done) {
            try {
                const user = await User.findById(jwt_payload.id);
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                return done(err, false);
            }
        })
    );
};

exports.login = asyncHandler(async (req, res, next) => {
    console.log('loging running...');
    const user = await User.findOne({ user_name: req.body.username });
    if (!user /*|| !user.verifyPassword(req.body.password)*/) {
        return res.status(401).send('Invalid credentials');
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
    res.redirect('/users');
});
