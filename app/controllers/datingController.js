const expressAsyncHandler = require('express-async-handler');
const Vehicle = require('../models/vehicle');
const VehicleController = require('../controllers/vehicleController');
const DatingProfile = require('../models/datingProfile');
const asyncHandler = require('express-async-handler');

exports.createDatingProfile = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return res.sendStatus(401);
    }
    const { typeProfile, categoryProfile, engineProfile, priceProfile, colourProfile, makeProfile, isAutomaticProfile, startDate, endDate } = req.body;

    const newDatingProfile = new DatingProfile({
        categoryProfile: categoryProfile,
        typeProfile: typeProfile,
        engineProfile:engineProfile,
        priceProfile: priceProfile,
        colourProfile: colourProfile,
        makeProfile: makeProfile,
        isAutomaticProfile: isAutomaticProfile, 
        startDate: startDate,
        endDate: endDate,
    });

    let savedDatingProfile;
    try {
        savedDatingProfile = await newDatingProfile.save();
    } catch (e) {
        res.status(400).send({ message: 'Could not create dating profile.' });
    }
});

async function buildDatingProfile(datingProfile, vehicleArray, startDate, endDate, branchName) { 
    for (var i = 0; i < vehicleArray.length; i++) {
        eval("datingProfile.categoryProfile." + vehicleArray[i].category) += 1/vehicleArray.length;
        eval("datingProfile.typeProfile." + vehicleArray[i].type) += 1/vehicleArray.length;
        eval("datingProfile.engineProfile." +vehicleArray[i].details.engineType) += 1/vehicleArray.length;
        eval("datingProfilecolourProfile." +vehicleArray[i].details.colour) += 1/vehicleArray.length;
        eval("datingProfile.makeProfile." +vehicleArray[i].details.make) += 1/vehicleArray.length;
        if(vehicleArray[i].details.isAutomatic){
            datingProfile.isAutomaticProfile += 1/vehicleArray.length;
        }

        if(vehicleArray[i].dailyPrice> priceProfile.max){
            datingProfile.priceProfile.max=vehicleArray[i].dailyPrice;
        }
        if(vehicleArray[i].dailyPrice< priceProfile.min){
           datingProfile.priceProfile.min=vehicleArray[i].dailyPrice;
        }
        datingProfile.priceProfile.avg += vehicleArray[i].dailyPrice/vehicleArray.length;
    
    }
    try {
        await datingProfile.save();
    } catch (e) {
        res.status(400).send({ message: 'Could not update dating profile.' });
    }
}


exports.matchDate = asyncHandler(async (req, res, next) => {
    const matchRate = 0;
    const datingProfile = req.datingProfile;
    const availableVehicles = findAvailableVehicles(datingProfile);
    //VehicleController.readAllVehicleObjects
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
function calculateMatchScore(vehicle, datingProfile){
    let score = 0;
    //logic here
    const categoryScore = eval("datingProfile.categoryProfile." + vehicle.category); //Need to fix "full-size"
    const typeScore = eval("datingProfile.typeProfile." + vehicle.type);
    const engineScore = eval("datingProfile.engineProfile." + vehicle.details.engineType);
    const colourScore = eval("datingProfile.colourProfile." + vehicle.details.colour);//To see if implement colour distance algorithm
    if(colourScore=="null"){  //null or undefined
        colourScore=0;
    }
    const makeScore = eval("datingProfile.makeProfile." + vehicle.details.make);
    if(makeScore=="null"){ //null or undefined
        makeScore=0;
    }
    const isAutomaticScore = datingProfile.isAutomaticProfile;
    const priceScore = calculatePriceScore(vehicle, datingProfile);
    let totalScore = (categoryScore + typeScore+ engineScore+ makeScore + isAutomaticScore +priceScore)/6;
    if ((totalScore+colourScore)/2>totalScore){ //colour score is only added as bonus points if it makes a better match
        totalScore= (totalScore+colourScore)/2; 
    }
    return totalScore;
}

/**
 * @param {Vehicle} vehicle
 * @param {datingProfile} datingProfile
 */
function calculatePriceScore(vehicle, datingProfile){
    //Uses min,max and avg from datingProfile to build a triangular distribution.
    const min = datingProfile.priceProfile.min;
    const max = datingProfile.priceProfile.max;
    const peak = datingProfile.priceProfile.avg;
    const vehiclePrice = vehicle.dailyPrice;
    const scoreFactor = 50(max-min); //Multiplication factor to get scores ranging from 0-100, where 100 if price=average=peak
    var PDF =0; // If outside bounds, PDF = 0
    //Triangle distribution PDF computation
    if(min<=vehiclePrice<=peak){
        PDF=2(vehiclePrice-min)/((max-min)(peak-min));
    }
    if(peak<vehiclePrice<=max){
        PDF=2(max-vehiclePrice)/((max-min)(max-peak));
    }
    return PDF*scoreFactor;
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

    // If we want to sort by branch, we can uncomment this underneath and replace availableVehicles with filteredVehicles
    // const filteredVehicles = availableVehicles.vehicles.filter(vehicle => vehicle.branch.name === branchName);

    // Shuffle the available vehicles 
    const shuffledVehicles = availableVehicles.sort(() => Math.random() - 0.5);

    // Return the first 10 vehicles as the random selection
    const randomVehicles = shuffledVehicles.slice(0, 10);

    return randomVehicles;
}
