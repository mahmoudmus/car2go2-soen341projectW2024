const Vehicle = require('../models/vehicle');
const asyncHandler = require('express-async-handler');

exports.createVehicle = asyncHandler(async (req, res, next) => {
    const { type, details, branch } = req.body;
    const available = Boolean(req.body.available);
    const hourlyPrice = parseFloat(req.body.hourlyPrice);

    const newVehicle = new Vehicle({
        type,
        details,
        branch,
        available,
        hourlyPrice,
    });

    let savedVehicle;
    try {
        savedVehicle = await newVehicle.save();
        res.send({ savedVehicle });
    } catch (e) {
        res.status(400).send({ message: 'Could not create vehicle.' });
    }
});

exports.readAllVehicles = asyncHandler(async (req, res, next) => {
    const vehicleList = await Vehicle.find({}, 'type available imageUrl');
    res.render('vehicle/list', { vehicleList });
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
    const { type, details, branch } = req.body;
    const available = Boolean(req.body.available);
    const hourlyPrice = parseFloat(req.body.hourlyPrice);

    try {
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).send({ message: 'Vehicle not found.' });
        }

        vehicle.type = type;
        vehicle.details = details;
        vehicle.branch = branch;
        vehicle.available = available;
        vehicle.hourlyPrice = hourlyPrice;

        const updatedVehicle = await vehicle.save();
        res.send({ updatedVehicle });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
});

exports.deleteVehicle = asyncHandler(async (req, res, next) => {
    // @todo tsk-12010
    res.sendStatus(404);
});
