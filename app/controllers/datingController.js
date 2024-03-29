const expressAsyncHandler = require('express-async-handler');
const Vehicle = require('../models/vehicle');
const VehicleController = require('../controllers/vehicleController');
const DatingProfile = require('../models/datingProfile');

exports.matchDate = asyncHandler(async (req, res, next) => {
    const matchRate = 0;
    const datingProfile = req.datingProfile;
    const availableVehicles = findAvailableVehicles(datingProfile);
    var highestScore = 0;
    var matchedvehicle;
    for(const vehicle in availableVehicles){  //calculates the score for each vehicle. Can reduce scope of availableVehicles by first filtering for strict preferences (ie colour MUST be red)
        let score = calculateMatchScore(vehicle, datingProfile);
        if(score>highestScore){
            highestScore = score;
            matchedvehicle = vehicle;
        }
    }
 
});

async function calculateMatchScore(vehicle, datingProfile){
    let score = 0;
    //logic here
    return score;
}


async function findAvailableVehicles(datingProfile) {
    //Not sure if there is a better way of doing this by calling vehicleController.readAvailableVehicles so doing this for now
    const startDate = datingProfile.startDate;
    const endDate = datingProfile.endDate;

    //->taken from vehicleController.readAvailableVehicles
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
        }
    );

    return availableVehicles;
}
