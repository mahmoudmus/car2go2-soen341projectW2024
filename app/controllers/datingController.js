const expressAsyncHandler = require('express-async-handler');
const Vehicle = require('../models/vehicle');
const VehicleController = require('../controllers/vehicleController');
const DatingProfile = require('../models/datingProfile');
const asyncHandler = require('express-async-handler');

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
    //TODO add routing when defined
    res.render('', { matchedvehicle, highestScore });  
    
});

/**
 * @param {Vehicle} vehicle
 * @param {datingProfile} datingProfile
 */
async function calculateMatchScore(vehicle, datingProfile){
    let score = 0;
    //logic here
    const categoryScore = eval("datingProfile.categoryProfile." + vehicle.category);v
    const TypeScore = eval("datingProfile.typeProfile." + vehicle.type);
    const engineScore = eval("datingProfile.engineProfile." + vehicle.details.engineType);
    const colourScore = eval("datingProfile.colourProfile." + vehicle.details.colour);
    const makeScore = eval("datingProfile.makeProfile." + vehicle.details.make);
    const isAutomaticScore =datingProfile.isAutomaticProfile;
    const priceScore = datingProfile.priceProfile.average;
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

    // If we want to sort by branch, we can uncomment this underneath and replace availableVehicles with filteredVehicles
    // const filteredVehicles = availableVehicles.vehicles.filter(vehicle => vehicle.branch.name === branchName);

    // Shuffle the available vehicles 
    const shuffledVehicles = availableVehicles.sort(() => Math.random() - 0.5);

    // Return the first 10 vehicles as the random selection
    const randomVehicles = shuffledVehicles.slice(0, 10);

    return randomVehicles;
}
