const Reservation = require('../models/reservation');
const Vehicle = require('../models/vehicle');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

exports.createReservation = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }
    if (req.body.email !== req.user.email && req.user.type !== 'admin') {
        return res.sendStatus(401);
    }

    const { startDate, endDate, vehicleId } = req.body;
    let user;
    if (req.body.email) {
        user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email.' });
        }
    } else {
        user = req.user;
    }

    const newReservation = new Reservation({
        user: user._id,
        vehicle: vehicleId,
        startDate,
        endDate,
    });

    try {
        const savedReservation = await newReservation.save();
        const populatedReservation = await Reservation.populate(
            savedReservation,
            ['user', 'vehicle']
        );
        res.render('reservation/row', {
            reservation: populatedReservation,
            layout: false,
        });
    } catch (e) {
        console.log(e);
        res.status(400).send({ message: 'Could not create reservation.' });
    }
});

exports.bookVehicle = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }

    const { startDate, endDate, vehicleId, dropoffLocation, accessories } =
        req.body;
    const pickupLocation = (await Vehicle.findById(vehicleId)).branch;
    const newReservation = new Reservation({
        user: req.user._id,
        vehicle: vehicleId,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        accessories,
    });

    try {
        const savedReservation = await newReservation.save();
        const populatedReservation = await Reservation.populate(
            savedReservation,
            ['user', 'vehicle']
        );

        const billingInformation =
            populatedReservation.user.billingInformation !== null;
        res.status(200).send({ reservation: populatedReservation });
    } catch (e) {
        console.log(e);
        res.status(400).send({ message: 'Could not create reservation.' });
    }
});

exports.readAllReservations = asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.type !== 'admin') {
        return res.render('user/login', {
            error: 'This page is restricted.',
        });
    }
    const reservationList = await Reservation.find()
        .populate('user')
        .populate('vehicle')
        .exec();
    res.render('reservation/list', { reservationList });
});
exports.readUserReservations = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.render('user/login', {
            error: 'Please Login',
        });
    }
    const currentUser = await User.findById(req.user._id);
    var query = { user: currentUser };
    const reservationList = await Reservation.find(query)
        .populate('user')
        .populate('vehicle')
        .exec();
    res.render('reservation/list', { reservationList });
});

exports.readReservation = asyncHandler(async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('user')
            .populate('vehicle');
        res.send({ reservation });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.updateReservation = asyncHandler(async (req, res, next) => {
    if (
        !req.user ||
        (req.body.email !== req.user.email && req.user.type !== 'admin')
    ) {
        return res.sendStatus(401);
    }

    const { startDate, endDate, vehicleId } = req.body;
    let user;
    if (req.body.email) {
        user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email.' });
        }
    } else {
        user = req.user;
    }

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
        return res.status(404).send({ message: 'Reservation not found.' });
    }

    reservation.user = user._id;
    reservation.vehicle = vehicleId;
    reservation.startDate = startDate;
    reservation.endDate = endDate;

    const updatedReservation = await reservation.save();
    const populatedReservation = await Reservation.populate(
        updatedReservation,
        ['user', 'vehicle']
    );
    res.send({ reservation: populatedReservation });
});

exports.deleteReservation = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const result = await Reservation.findByIdAndDelete(id);
    if (!result) {
        return res.status(404).json({ message: 'Reservation not found.' });
    }
    res.send({ message: 'Reservation deleted successfully.' });
});

exports.servePayment = asyncHandler(async (req, res, next) => {
    res.render('reservation/checkout');
});

exports.processPayment = asyncHandler(async (req, res, next) => {
    const { cardNumber, cvv, expiryDate, cardHolderName, address, postalCode } =
        req.body;
    if (cardNumber < 1000000000000000 || cardNumber > 9999999999999999) {
        return res.render('reservation/checkout', {
            error: 'Invalid card number.',
        });
    } else if (cvv < 100 || cvv > 9999) {
        return res.render('reservation/checkout', { error: 'Invalid CVV.' });
    }
    res.redirect('/myreservations');
});
