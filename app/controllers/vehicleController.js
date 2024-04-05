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

exports.filterVehicles = async function (requestQuery) {
    const { start, end, postal } = requestQuery;

    if (Boolean(start) ^ Boolean(end)) {
        throw new Error('Please select both a start date and end date.');
    }

    let databaseQuery = {};
    let branchLabel = 'All Branches';
    if (Boolean(start) && Boolean(end)) {
        const overlappingReservations = await Reservation.find({
            startDate: { $lt: new Date(decodeURIComponent(end)) },
            endDate: { $gt: new Date(decodeURIComponent(start)) },
        });
        const reservedVehicleIds = overlappingReservations.map(
            (reservation) => reservation.vehicle
        );
        databaseQuery._id = { $nin: reservedVehicleIds };
    }

    if (Boolean(postal) && !process.env.GEOCODE_KEY) {
        console.log('No GEOCODE_KEY - using random branch');
        const anyBranch = await Branch.findOne();
        databaseQuery.branch = anyBranch._id;
        branchLabel = anyBranch.name;
    } else if (Boolean(postal)) {
        const key = process.env.GEOCODE_KEY;
        const address = decodeURIComponent(postal);

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
            throw new Error(
                'An error occured while verifying your location. Please try another postal code or airport.'
            );
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
            throw new Error('No branches found near your location.');
        }
        databaseQuery.branch = closestBranch[0]._id;
        branchLabel = closestBranch[0].name;
    }

    try {
        if (requestQuery.category) {
            databaseQuery.category = decodeURIComponent(
                requestQuery.category
            ).toLowerCase();
        }
        if (requestQuery.type) {
            databaseQuery.type = decodeURIComponent(
                requestQuery.type
            ).toLowerCase();
        }
        if (requestQuery.make) {
            const regex = new RegExp(
                decodeURIComponent(requestQuery.make),
                'i'
            );
            databaseQuery['details.make'] = { $regex: regex };
        }
        if (requestQuery.model) {
            const regex = new RegExp(
                decodeURIComponent(requestQuery.model),
                'i'
            );
            databaseQuery['details.model'] = { $regex: regex };
        }
        if (requestQuery.minYear) {
            databaseQuery['details.year'] = {
                $gte: decodeURIComponent(requestQuery.minYear),
            };
        }
        if (requestQuery.maxYear) {
            databaseQuery['details.year'] = {
                $lte: decodeURIComponent(requestQuery.maxYear),
            };
        }
        if (requestQuery.isAutomatic) {
            if (decodeURIComponent(requestQuery.isAutomatic) === 'true') {
                databaseQuery['details.isAutomatic'] = true;
            }
        }
        if (requestQuery.minPrice) {
            databaseQuery.dailyPrice = {
                $gte: decodeURIComponent(requestQuery.minPrice),
            };
        }
        if (requestQuery.maxPrice) {
            databaseQuery.dailyPrice = {
                $lte: decodeURIComponent(requestQuery.maxPrice),
            };
        }
    } catch (e) {
        throw new Error(`Error in filtering Vehicles: ${e}`);
    }

    const vehicleList = await Vehicle.find(
        databaseQuery,
        'details type imageUrl dailyPrice category'
    );

    return { vehicleList, branchLabel };
};

exports.readAllVehicles = asyncHandler(async (req, res, next) => {
    try {
        let { vehicleList, branchLabel } = await exports.filterVehicles(
            req.query
        );
        res.render('vehicle/list', { vehicleList, branchLabel });
    } catch (e) {
        return res.render('vehicle/list', {
            vehicleList: [],
            error: e.message,
            branchLabel: '',
        });
    }
});

exports.readAllVehicleObjects = asyncHandler(async (req, res, next) => {
    try {
        let { vehicleList, branchLabel } = await exports.filterVehicles(
            req.query
        );
        res.send({ vehicleList, branchLabel });
    } catch (e) {
        res.send({ message: 'Vehicle not found' });
    }
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
