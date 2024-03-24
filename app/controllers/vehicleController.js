const Vehicle = require('../models/vehicle');
const Reservation = require('../models/reservation');
const Branch = require('../models/branch');
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const Accessory = require('../models/accessory');

exports.createVehicle = asyncHandler(async (req, res, next) => {
    const { type, category, details, branch, imageUrl, licensePlateNumber } =
        req.body;
    const dailyPrice = parseFloat(req.body.dailyPrice);

    const newVehicle = new Vehicle({
        type,
        category,
        details,
        branch,
        imageUrl,
        dailyPrice,
        licensePlateNumber,
    });

    let savedVehicle;
    try {
        savedVehicle = await newVehicle.save();
        res.render('vehicle/row', { vehicle: savedVehicle, layout: false });
    } catch (e) {
        res.status(400).send({ message: 'Could not create vehicle.' });
    }
});

exports.readAllVehicles = asyncHandler(async (req, res, next) => {
    const { start, end, postal } = req.query;

    if (Boolean(start) ^ Boolean(end)) {
        return res.render('vehicle/list', {
            vehicleList: [],
            error: 'Please select both a start date and end date.',
        });
    }

    let query = {};
    if (Boolean(start) && Boolean(end)) {
        const overlappingReservations = await Reservation.find({
            startDate: { $lt: new Date(end) },
            endDate: { $gt: new Date(start) },
        });
        const reservedVehicleIds = overlappingReservations.map(
            (reservation) => reservation.vehicle
        );
        query._id = { $nin: reservedVehicleIds };
    }

    if (Boolean(postal) && !process.env.GEOCODE_KEY) {
        console.log(
            'GEOCODE_KEY environment variable is not set. Using random branch'
        );
        query.branch = (await Branch.findOne())._id;
    } else if (Boolean(postal)) {
        const key = process.env.GEOCODE_KEY;

        const targetUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            postal
        )}&key=${key}`;
        let userLocation; // [longitude, latitude];
        try {
            const response = await axios.get(targetUrl);
            const bounds = response.data.results[0].geometry.bounds;
            userLocation = [
                (bounds.northeast.lng + bounds.southwest.lng) / 2,
                (bounds.northeast.lat + bounds.southwest.lat) / 2,
            ];
        } catch (error) {
            return res.render('vehicle/list', {
                vehicleList: [],
                error: 'An error occured while verifying your location. Please try another postal or zip code.',
            });
        }
        const closestBranch = await Branch.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: userLocation,
                    },
                },
            },
        }).limit(1);
        if (closestBranch.length === 0) {
            return res.render('vehicle/list', {
                vehicleList: [],
                error: 'No branches found near your location.',
            });
        }
        query.branch = closestBranch[0]._id;
    }

    const vehicleList = await Vehicle.find(
        query,
        'details type imageUrl dailyPrice'
    );
    res.render('vehicle/list', { vehicleList });
});

exports.readAvailableVehicles = asyncHandler(async (req, res, next) => {
    try {
        const startDate = new Date(req.query.start);
        const endDate = new Date(req.query.end);

        // Find reservations that overlap with the requested date range
        const overlappingReservations = await Reservation.find({
            startDate: { $lt: endDate },
            endDate: { $gt: startDate },
        });

        // Get the IDs of vehicles from overlapping reservations
        const reservedVehicleIds = overlappingReservations.map(
            (reservation) => reservation.vehicle
        );

        // Find available vehicles that do not have reservations in the given date range
        const availableVehicles = await Vehicle.find(
            {
                _id: { $nin: reservedVehicleIds },
            },
            'details imageUrl dailyPrice'
        );

        res.json({ vehicles: availableVehicles });
    } catch (e) {
        console.error('Error in readAvailableVehicles:', e);
        res.status(500).json({ message: 'Server error' });
    }
});

exports.getBooking = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.render('user/login', {
            error: 'You must be logged in to make a reservation.',
        });
    }
    const vehicle = await Vehicle.findById(req.params.id)
        .populate('branch')
        .exec();
    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }
    const accessories = await Accessory.find({}, 'name price');
    const email = req.query.email ?? null;
    res.render('reservation/booking', {
        vehicle,
        accessories,
        email,
    });
});

exports.readVehicle = asyncHandler(async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.send({ vehicle });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.updateVehicle = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const { type, category, details, branch, imageUrl, licensePlateNumber } =
        req.body;
    const dailyPrice = parseFloat(req.body.dailyPrice);

    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
        return res.status(404).send({ message: 'Vehicle not found.' });
    }

    vehicle.type = type;
    vehicle.category = category;
    vehicle.details = details;
    vehicle.branch = branch;
    vehicle.imageUrl = imageUrl;
    vehicle.dailyPrice = dailyPrice;
    vehicle.licensePlateNumber = licensePlateNumber;

    const updatedVehicle = await vehicle.save();
    res.send({ updatedVehicle });
});

exports.deleteVehicle = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    await Reservation.deleteMany({ vehicle: id });
    const result = await Vehicle.findByIdAndDelete(id);
    if (!result) {
        return res.status(404).json({ message: 'Vehicle not found.' });
    }
    res.send({ message: 'Vehicle deleted successfully.' });
});

exports.readUnavailabilities = asyncHandler(async (req, res, next) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Get reservations for the specific vehicle
        const reservations = await Reservation.find({ vehicle: req.params.id });

        // Extract the dates during which the vehicle is unavailable
        const unavailabilities = reservations.reduce((dates, reservation) => {
            const currentStartDate = new Date(reservation.startDate);
            const currentEndDate = new Date(reservation.endDate);

            // Generate an array of dates between start and end (inclusive)
            const dateArray = [];
            for (
                let date = currentStartDate;
                date <= currentEndDate;
                date.setDate(date.getDate() + 1)
            ) {
                dateArray.push(date.toISOString());
            }

            return dates.concat(dateArray);
        }, []);

        res.json({
            vehicle,
            unavailabilities,
        });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});
