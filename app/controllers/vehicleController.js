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
            branchLabel: '',
        });
    }

    let query = {};
    let branchLabel = 'All Branches';
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
        const anyBranch = await Branch.findOne();
        query.branch = anyBranch._id;
        branchLabel = anyBranch.name;
    } else if (Boolean(postal)) {
        const key = process.env.GEOCODE_KEY;

        const address = postal;

        console.log(address);
        const targetUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
        )}&key=${key}`;
        let userLocation; // [longitude, latitude];
        try {
            const response = await axios.get(targetUrl);
            const geometry = response.data.results[0].geometry;
            if (geometry.bounds) {
                const bounds = geometry.bounds;
                userLocation = [
                    (bounds.northeast.lng + bounds.southwest.lng) / 2,
                    (bounds.northeast.lat + bounds.southwest.lat) / 2,
                ];
            } else {
                userLocation = [geometry.location.lng, geometry.location.lat];
            }
        } catch (error) {
            console.log(error);
            return res.render('vehicle/list', {
                vehicleList: [],
                error: 'An error occured while verifying your location. Please try another postal code or airport.',
                branchLabel,
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
                branchLabel: '',
            });
        }
        query.branch = closestBranch[0]._id;
        branchLabel = closestBranch[0].name;
    }

    // Filter vehicles
    try {
        if (req.query.category) {
            query.category = req.query.category.toLowerCase();
        }
        if (req.query.type) {
            query.type = req.query.type.toLowerCase();
        }
        if (req.query.make) {
            const regex = new RegExp(req.query.make, 'i');
            query['details.make'] = { $regex: regex };
        }
        if (req.query.model) {
            const regex = new RegExp(req.query.model, 'i');
            query['details.model'] = { $regex: regex };
        }
        if (req.query.minYear) {
            query['details.year'] = { $gte: req.query.minYear };
        }
        if (req.query.maxYear) {
            query['details.year'] = { $lte: req.query.maxYear };
        }
        if (req.query.isAutomatic) {
            query['details.isAutomatic'] =
                req.query.isAutomatic === 'on' ? true : false;
        }
        if (req.query.minPrice) {
            query.dailyPrice = { $gte: req.query.minPrice };
        }
        if (req.query.maxPrice) {
            query.dailyPrice = { $lte: req.query.maxPrice };
        }
    } catch (e) {
        console.error('Error in filtering Vehicles:', e);
        res.status(500).json({ message: 'Server error' });
    }
    const vehicleList = await Vehicle.find(
        query,
        'details type imageUrl dailyPrice'
    );
    res.render('vehicle/list', { vehicleList, branchLabel });
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
