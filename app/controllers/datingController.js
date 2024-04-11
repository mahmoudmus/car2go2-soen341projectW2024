const expressAsyncHandler = require('express-async-handler');
const Vehicle = require('../models/vehicle');
const Reservation = require('../models/reservation');
const VehicleController = require('../controllers/vehicleController');
const DatingProfile = require('../models/datingProfile');
const asyncHandler = require('express-async-handler');
const Branch = require('../models/branch');

/*current algorithm flaws:
    If profile attributes are equally distributed (ex. all categories are at 25%). This will result in a low score. However, this actually indicates "no pref",
    and hence shouldn't be taken into account for the score calculation. Also have to take into account weak pref(only wants 3 categories, they are all at 33%)

    Triangle Distribution is not very accurate (using better distribution requires changing the model and changing)

    Does not work if no postalcode/branch is provided

    If 2 or more vehicles get the same score, only the first will be used

*/

exports.createDatingProfile = asyncHandler(async (req, res, next) => {
    const {vehicleArray, startDate, endDate, branchName} = req.body;
    const newDatingProfile = new DatingProfile({ //Should be added as defaults in the model if possible
        categoryProfile: {
            compact: 0,
            standard: 0,
            intermediate: 0,
            fullsize: 0
        },
    
        typeProfile: {
            car: 0,
            suv: 0,
            van: 0,
            truck: 0
        },
    
        engineProfile: {
            gas: 0,
            electric: 0,
            hybrid: 0
        },
    
        priceProfile:{
            min: null,
            max: null,
            avg: 0
        },
    
        colourProfile: new Map(),
        makeProfile: new Map(),
        isAutomaticProfile: 0,
        startDate: startDate,
        endDate: endDate
    });

    let savedDatingProfile;
    try {
        savedDatingProfile = await newDatingProfile.save();
    } catch (e) {
        res.status(400).send({ message: 'Could not create dating profile.' });
    }
    try{
        await exports.buildDatingProfile(savedDatingProfile, vehicleArray);
    } catch (e){
        res.status(400).send({ message: 'Could not update dating profile.' }); 
    }
    
    const [matchedVehicle, highestScore] = await exports.matchDate(savedDatingProfile, startDate, endDate, branchName);
    res.send({matchedVehicle, highestScore});
});

exports.buildDatingProfile = async function(datingProfile, vehicleArray) {
    for (let vehicle of vehicleArray) {
        const incrementNumber = 1/vehicleArray.length*100;

        datingProfile.categoryProfile[vehicle.category] += incrementNumber;
        datingProfile.typeProfile[vehicle.type] += incrementNumber;
        datingProfile.engineProfile[vehicle.details.engineType] += incrementNumber;
        
        //All my homies loves embedded maps as documents :)
        const colourKey = vehicle.details.colour;
        const colourValue = datingProfile.colourProfile.get(colourKey);
        const colorMap = datingProfile.colourProfile;
        colorMap.has(colourKey) ? colorMap.set(colourKey, colourValue +incrementNumber) : colorMap.set(colourKey, incrementNumber);

        const makeKey = vehicle.details.make;
        const makeValue = datingProfile.makeProfile.get(makeKey);
        const makeMap = datingProfile.makeProfile
        makeMap.has(makeKey) ? makeMap.set(makeKey, makeValue +incrementNumber) : makeMap.set(makeKey, incrementNumber);


        if(vehicle.dailyPrice> datingProfile.priceProfile.max || datingProfile.priceProfile.max == null){
            datingProfile.priceProfile.max=vehicle.dailyPrice;
        }
        if(vehicle.dailyPrice< datingProfile.priceProfile.min || datingProfile.priceProfile.min == null){
           datingProfile.priceProfile.min=vehicle.dailyPrice;
        }
        datingProfile.priceProfile.avg += vehicle.dailyPrice/vehicleArray.length;

        if(vehicle.details.isAutomatic){
            datingProfile.isAutomaticProfile += incrementNumber; 
        }
    
    }
    await datingProfile.save();
    return true;
}


exports.matchDate = async function(datingProfile, startDate, endDate, branchName){
    const availableVehicles = await findAvailableVehicles(startDate, endDate, branchName);
    let highestScore = 0;
    let matchedvehicle;
    availableVehicles.forEach((vehicle) =>{ //calculates the score for each vehicle. Can reduce scope of availableVehicles by first filtering for strict preferences (ie colour MUST be red). But then have to take into account case where query is empty.  
            let score = calculateMatchScore(vehicle, datingProfile);
            if(score>highestScore){
                highestScore = score;
                matchedvehicle = vehicle;
            }
    }
    );
    return [matchedvehicle, highestScore];
}

/**
 * @param {Vehicle} vehicle
 * @param {datingProfile} datingProfile
 */
function calculateMatchScore(vehicle, datingProfile){
    const categoryScore = datingProfile.categoryProfile[vehicle.category];
    const typeScore = datingProfile.typeProfile[vehicle.type];
    const engineScore = datingProfile.engineProfile[vehicle.details.engineType];
    let colourScore = datingProfile.colourProfile.get(vehicle.details.colour); //To see if implement colour distance algorithm
    if(colourScore=="null"){  //null or undefined
        colourScore=0;
    }

    let makeScore = datingProfile.makeProfile.get(vehicle.details.make);
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
    //Uses min, max and avg from datingProfile to build a triangular distribution.
    const min = datingProfile.priceProfile.min;
    const max = datingProfile.priceProfile.max;
    const peak = datingProfile.priceProfile.avg;
    const vehiclePrice = vehicle.dailyPrice;
    const scoreFactor = 50*(max-min); //Multiplication factor to get scores ranging from 0-100, where 100 if price=average=peak
    let PDF =0; // If outside bounds, PDF = 0
    //Triangle distribution PDF computation
    if(min<=vehiclePrice && vehiclePrice<=peak){
        PDF=2*(vehiclePrice-min)/((max-min)*(peak-min));
    }else if(peak< vehiclePrice && vehiclePrice <=max){
        PDF=2*(max-vehiclePrice)/((max-min)*(max-peak));
    }else{
        return 0
    }
    const adjustedScale= 1/2*(PDF*scoreFactor)+50;
    return adjustedScale;
}


async function findAvailableVehicles(startDate, endDate, branchName) {
    // Find reservations that overlap with the requested date range
     const overlappingReservations = await Reservation.find({
        startDate: { $lt: endDate },
        endDate: { $gt: startDate },
    });

    // Get the IDs of vehicles from overlapping reservations
    const reservedVehicleIds = overlappingReservations.map(
        (reservation) => reservation.vehicle
    );

    const branch= await Branch.findOne({name: branchName});
    let availableVehicles;
    if(branch == null){
        availableVehicles = await Vehicle.find(
            {
                _id: {$nin: reservedVehicleIds },
            }
        )
    }else{
        availableVehicles = await Vehicle.find(
            {
                _id: { $nin: reservedVehicleIds },
                branch: branch._id
            }
        );
    }

    return availableVehicles;
}

exports.datingDashboard = asyncHandler(async (req, res, next) => {
    res.render('dating/start');
});
