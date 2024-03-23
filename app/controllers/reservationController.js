const Reservation = require('../models/reservation');
const Vehicle = require('../models/vehicle');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const asyncHandler = require('express-async-handler');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || 'placeholder',
});
const ejs = require('ejs');
const path = require('path');

exports.computeCost = async ({ startDate, endDate, vehicleId }) => {
    const vehicle = await Vehicle.findById(vehicleId);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    const cost = days * vehicle.dailyPrice * 1.14975;
    return cost;
};

exports.createReservation = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }
    if (req.body.email !== req.user.email && req.user.type !== 'admin') {
        return res.sendStatus(401);
    }

    const { startDate, endDate, vehicleId } = req.body;
    const cost = await exports.computeCost({ startDate, endDate, vehicleId });
    let user;
    if (req.body.email) {
        user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'Invalid email.' });
        }
    } else {
        user = req.user;
    }

    const vehicle = await Vehicle.findById(vehicleId, 'branch');
    const newReservation = new Reservation({
        user: user._id,
        vehicle: vehicleId,
        startDate,
        endDate,
        pickupLocation: vehicle.branch,
        dropoffLocation: vehicle.branch,
        cost,
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

    const {
        startDate,
        endDate,
        vehicleId,
        dropoffLocation,
        accessories,
        cost,
        email,
    } = req.body;

    let user = req.user;
    if (email) {
        user = await User.findOne({ email });
    }

    const pickupLocation = (await Vehicle.findById(vehicleId)).branch;
    const newReservation = new Reservation({
        user: user._id,
        vehicle: vehicleId,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        accessories,
        cost,
    });

    try {
        const reservation = await newReservation.save();
        // @todo check for all billingInfo elements! all must be present.
        const billingInformation = Boolean(
            req.user.billingInformation.cardNumber
        );
        res.status(200).send({
            billingInformation,
            reservation,
        });
    } catch (e) {
        console.log(e);
        res.status(400).send({ message: 'Could not create reservation.' });
    }
});

exports.readAllReservations = asyncHandler(async (req, res, next) => {
    if (!req.user || !['admin', 'csr'].includes(req.user.type)) {
        return res.render('user/login', {
            error: 'This page is restricted.',
        });
    }

    const userEmail = req.query.email || null;

    try {
        let query = {};
        let userQuery = {};

        if (userEmail) {
            // Build the user query to find the user with the specified email
            userQuery = { email: userEmail };
            const user = await User.findOne(userQuery);

            // If user exists, filter reservations by user ID
            if (user) {
                query = { user: user._id };
            } else {
                // If user doesn't exist, return empty reservation list
                return res.render('reservation/list', {
                    reservationList: [],
                    userEmail,
                });
            }
        }

        const reservationList = await Reservation.find(query)
            .populate('user')
            .populate('vehicle')
            .exec();

        res.render('reservation/list', { reservationList, userEmail });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({ message: 'Server error' });
    }
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

exports.updateReservationStatus = asyncHandler(async (req, res, next) => {
    if (!req.user || !['admin', 'csr'].includes(req.user.type)) {
        return res.sendStatus(401);
    }

    const { status } = req.body;
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
        return res.status(404).send({ message: 'Reservation not found.' });
    }

    reservation.status = status;
    await reservation.save();
    res.sendStatus(200);
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
    res.render('reservation/payment');
});

exports.returnCar = asyncHandler(async (req, res, next) => {
    res.render('reservation/return', { reservationId: req.params.id });
});

exports.processPayment = asyncHandler(async (req, res, next) => {
    const { cardNumber, cvv, expiryDate, cardHolderName, address, postalCode } =
        req.body;
    if (cardNumber < 1000000000000000 || cardNumber > 9999999999999999) {
        return res.render('reservation/payment', {
            error: 'Invalid card number.',
        });
    } else if (cvv < 100 || cvv > 9999) {
        return res.render('reservation/payment', { error: 'Invalid CVV.' });
    }
    res.redirect('/myreservations');
});

exports.emailConfirmation = asyncHandler(async (req, res, next) => {
    const { reservationId } = req.body;
    const reservation = await Reservation.findById(reservationId)
        .populate('pickupLocation')
        .populate('dropoffLocation')
        .populate('user')
        .populate('vehicle')
        .populate('accessories');

    const html = await ejs.renderFile(
        path.join(__dirname, '../views/emails/confirmation.ejs'),
        {
            reservation,
        }
    );

    const user = reservation.user;
    const message = {
        html,
        subject: 'Gas Booking Confirmation',
        from: 'Gas <info@gassycar.com>',
        to: [user.email, 'tommy.mahut@gmail.com'],
    };

    const response = await mg.messages.create('gassycar.com', message);
    res.send(response);
});

exports.emailBill = asyncHandler(async (req, res, next) => {
    const { bill, reservationId } = req.body;
    const reservation = await Reservation.findById(reservationId)
        .populate('pickupLocation')
        .populate('dropoffLocation')
        .populate('user')
        .populate('vehicle')
        .populate('accessories');

    const html = await ejs.renderFile(
        path.join(__dirname, '../views/emails/bill.ejs'),
        {
            reservation,
            bill,
        }
    );

    const user = reservation.user;
    const message = {
        html,
        subject: 'Gas Booking Confirmation',
        from: 'Gas <info@gassycar.com>',
        to: [user.email, 'tommy.mahut@gmail.com'],
    };

    const response = await mg.messages.create('gassycar.com', message);
    res.send(response);
});

exports.startCheckin = asyncHandler(async (req, res, next) => {
    const reservationId = req.params.id;
    const reservation = await Reservation.findById(reservationId)
        .populate('user')
        .populate('vehicle')
        .populate('accessories')
        .populate('pickupLocation')
        .populate('dropoffLocation')
        .exec();
    res.render('reservation/checkin', { reservation });
});

exports.generateBill = asyncHandler(async (req, res, next) => {
    const { damagesCost } = req.body;
    const reservationId = req.params.id;
    const reservation = await Reservation.findById(reservationId)
        .populate('pickupLocation')
        .populate('dropoffLocation')
        .populate('user')
        .populate('vehicle')
        .populate('accessories');
    res.render('reservation/bill', { reservation, damagesCost, layout: false });
});

exports.saveBillingInformation = asyncHandler(async (req, res, next) => {
    const reservationId = req.params.id;
    const reservation = await Reservation.findById(reservationId);
    const user = await User.findById(reservation.user);

    // @todo potential backend validation for billing information

    user.billingInformation = req.body;
    const updatedUser = await user.save();
    res.sendStatus(200);
});

exports.walkinDashboard = asyncHandler(async (req, res, next) => {
    if (!req.user || !['admin', 'csr'].includes(req.user.type)) {
        res.render('user/login', {
            error: 'This page is restricted.',
        });
    } else {
        res.render('reservation/walkin');
    }
});
