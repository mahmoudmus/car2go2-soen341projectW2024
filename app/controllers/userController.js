const User = require('../models/user');
const Reservation = require('../models/reservation');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

exports.signUp = asyncHandler(async (req, res, next) => {
    const {
        name,
        email,
        age,
        address,
        phoneNumber,
        driverLicenseNumber,
        hash,
    } = req.body;

    if (age < 18) {
        return res.render('user/signup', {
            error: 'You must be at least 18 years of age to sign up.',
        });
    } else if (!/^[0-9\s\-\(\)]+$/.test(phoneNumber)) {
        return res.render('user/signup', {
            error: 'Phone numbers can only contain digits, hyphens, spaces, and parentheses.',
        });
    } else if (!/^[A-Za-z0-9\- ]+$/.test(driverLicenseNumber)) {
        return res.render('user/signup', {
            error: "Driver's license number can only contain letters, numbers, hyphens, and spaces.",
        });
    }

    const user = new User({
        name,
        email,
        age,
        address,
        phoneNumber,
        driverLicenseNumber,
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
    const {
        name,
        email,
        age,
        address,
        phoneNumber,
        driverLicenseNumber,
        type,
        hash,
    } = req.body;

    if (age < 18) {
        return res.status(400).json({
            message: 'Users must be at least 18 years of age.',
        });
    } else if (!/^[0-9\s\-\(\)]+$/.test(phoneNumber)) {
        return res.status(400).json({
            message:
                'Phone numbers can only contain digits, hyphens, spaces, and parentheses.',
        });
    } else if (!/^[A-Za-z0-9\- ]+$/.test(driverLicenseNumber)) {
        return res.status(400).json({
            message:
                "Driver's license number can only contain letters, numbers, hyphens, and spaces.",
        });
    }

    const user = new User({
        name,
        email,
        age,
        address,
        phoneNumber,
        driverLicenseNumber,
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
    if (!req.user || !['admin', 'csr'].includes(req.user.type)) {
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

exports.readLoggedInEmail = asyncHandler(async (req, res, next) => {
    if (req.user) {
        res.json({ email: req.user.email });
    } else {
        res.status(401).json({
            message: 'You must be logged in to make a reservation.',
        });
    }
});

exports.findUserByEmail = asyncHandler(async (req, res, next) => {
    const email = await User.findOne({ email: req.body.email.toLowerCase() });
    if (email == null) {
        return res.status(404).json({ message: 'User not found' });
    } else {
        return res.status(200).json({ email });
    }
});

exports.updateProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (req.user && req.user.email === user.email) {
        const { name, age, email, address, phoneNumber, driverLicenseNumber } =
            req.body;

        if (age < 18) {
            return res.render('user/profile', {
                user,
                error: 'You must be at least 18 years of age.',
            });
        }
        user.name = name;
        user.age = age;
        user.email = email;
        user.address = address;
        user.phoneNumber = phoneNumber;
        user.driverLicenseNumber = driverLicenseNumber;

        try {
            await user.save();
        } catch (error) {
            let message;
            switch (error.code) {
                case 11000: // Duplicate key error
                    message = 'Email already in use.';
                    break;
                default:
                    message = error.message;
            }
            res.render('user/profile', { user, error: message });
        }

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
    if (!(req.user && (req.user.type === 'admin' || req.user.type === 'csr'))) {
        return res
            .status(401)
            .json({ message: 'You do not have admin privileges.' });
    }

    const {
        name,
        age,
        email,
        address,
        phoneNumber,
        driverLicenseNumber,
        type,
        hash,
    } = req.body;

    if (age < 18) {
        return res.status(400).json({
            message: 'Users must be at least 18 years of age.',
        });
    } else if (!/^[0-9\s\-\(\)]+$/.test(phoneNumber)) {
        return res.status(400).json({
            message:
                'Phone numbers can only contain digits, hyphens, spaces, and parentheses.',
        });
    } else if (!/^[A-Za-z0-9\- ]+$/.test(driverLicenseNumber)) {
        return res.status(400).json({
            message:
                "Driver's license number can only contain letters, numbers, hyphens, and spaces.",
        });
    }

    const allowedFields =
        req.user.type === 'admin'
            ? [
                  'name',
                  'age',
                  'email',
                  'address',
                  'phoneNumber',
                  'driverLicenseNumber',
                  'type',
                  'hash',
              ]
            : ['name', 'age', 'address', 'phoneNumber', 'driverLicenseNumber'];

    Object.keys(req.body).forEach((key) => {
        if (allowedFields.includes(key)) {
            if (!(key === 'hash' && req.body.hash === '')) {
                user[key] = req.body[key];
            }
        }
    });

    try {
        const updatedUser = await user.save();
        res.status(200).json({ updatedUser });
    } catch (e) {
        if (e.code === 11000) {
            res.status(400).json({
                message: `${email} is already in use.`,
            });
        } else {
            console.log(e);
            res.status(500).json({ message: 'An unexpected error occurred.' });
        }
    }
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    await Reservation.deleteMany({ user: id });
    const result = await User.findByIdAndDelete(id);
    if (!result) {
        return res.status(404).json({ message: 'User not found.' });
    }
    if (id === req.user.id) {
        res.clearCookie('jwt');
    }
    res.json({ message: 'User deleted successfully.' });
});
