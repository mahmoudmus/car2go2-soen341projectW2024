const Reservation = require('../models/reservation');
const Vehicle = require('../models/vehicle');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');

exports.createReservation = asyncHandler(async (req, res, next) => {
    const {
        vehicle_id,
        user_id,
        start_time,
        end_time,
        pickup_location_id,
        dropoff_location_id,
        status,
    } = req.body;

    const newReservation = new Reservation({
        vehicle_id,
        user_id,
        start_time,
        end_time,
        pickup_location_id,
        dropoff_location_id,
        status,
    });

    let savedReservation;
    try {
        savedReservation = await newReservation.save();
        res.render('reservation/row', {
            reservation: savedReservation,
            layout: false,
        });
    } catch (e) {
        res.status(400).send({ message: 'Could not create reservation.' });
    }
});

exports.readAllReservations = asyncHandler(async (req, res, next) => {
    const reservationList = await Reservation.find()
        .populate('user_name')
        .populate('type')
        .exec();
    res.render('reservation/list', { reservationList });
});

exports.readReservation = asyncHandler(async (req, res, next) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        const vehicle = await Vehicle.findById(reservation.vehicle_id);
        const user = await User.findById(reservation.user_id);
        if (!reservation || vehicle || user) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.send({ reservation, user, vehicle });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.updateReservation = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const {
        vehicle_id,
        user_id,
        start_time,
        end_time,
        pickup_location_id,
        dropoff_location_id,
        status,
    } = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
        return res.status(404).send({ message: 'Reservation not found.' });
    }

    reservation.vehicle_id = vehicle_id;
    reservation.user_id = user_id;
    reservation.start_time = start_time;
    reservation.end_time = end_time;
    reservation.pickup_location_id = pickup_location_id;
    reservation.dropoff_location_id = dropoff_location_id;
    reservation.status = status;

    const updatedReservation = await reservation.save();
    res.send({ updatedReservation });
});

exports.deleteReservation = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const result = await Reservation.findByIdAndDelete(id);
    if (!result) {
        return res.status(404).json({ message: 'Reservation not found.' });
    }
    res.send({ message: 'Reservation deleted successfully.' });
});
