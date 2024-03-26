const Branch = require('../models/branch');
const asyncHandler = require('express-async-handler');
const axios = require('axios');

exports.getAllBranches = asyncHandler(async (req, res, next) => {
    const branches = await Branch.find({}, '');
    res.send({ branches });
});

exports.getBranch = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const branch = await Branch.findById(id);
    res.send({ branch });
});

exports.getNearestBranch = asyncHandler(async (req, res, next) => {
    const key = process.env.GEOCODE_KEY;
    if (!key) {
        const branch = await Branch.findOne();
        return res.send({ branch });
    }

    const postal = req.params.postal;
    const targetUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        postal
    )}&key=${key}`;

    // Getting user coordinates.
    let location;
    try {
        const response = await axios.get(targetUrl);
        const geometry = response.data.results[0].geometry;
        if (geometry.bounds) {
            const bounds = geometry.bounds;
            location = [
                (bounds.northeast.lng + bounds.southwest.lng) / 2,
                (bounds.northeast.lat + bounds.southwest.lat) / 2,
            ];
        } else {
            location = [geometry.location.lng, geometry.location.lat];
        }
    } catch (e) {
        res.status(400);
        res.send({ message: 'Could not fetch nearest branch location.' });
        return;
    }

    // Getting the nearest branch to the user's coordinates.
    const closestBranches = await Branch.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: location,
                },
            },
        },
    }).limit(1);

    res.send({ branch: closestBranches[0] });
});
