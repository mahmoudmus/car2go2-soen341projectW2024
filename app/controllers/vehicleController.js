const Vehicle = require('../models/vehicle');
const Reservation = require('../models/reservation');
const asyncHandler = require('express-async-handler');

exports.createVehicle = asyncHandler(async (req, res, next) => {
    const { type, category, details, branch, imageUrl } = req.body;
    const dailyPrice = parseFloat(req.body.dailyPrice);

    const newVehicle = new Vehicle({
        type,
        category,
        details,
        branch,
        imageUrl,
        dailyPrice,
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
    const vehicleList = await Vehicle.find(
        {},
        'details type imageUrl dailyPrice'
    );
    res.render('vehicle/list', { vehicleList });
});

exports.readAvailableVehicles = asyncHandler(async (req, res, next) => {
    try {
        const startDate = new Date(req.query.start);
        const endDate = new Date(req.query.end);
        console.log(`Start Date: ${startDate}`);
        console.log(`End Date: ${endDate}`);

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
    const { type, category, details, branch, imageUrl } = req.body;
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
