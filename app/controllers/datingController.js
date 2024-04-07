const expressAsyncHandler = require('express-async-handler');
const Vehicle = require('../models/vehicle');
const Reservation = require('../models/reservation');
const VehicleController = require('../controllers/vehicleController');
const DatingProfile = require('../models/datingProfile');
const asyncHandler = require('express-async-handler');
const Branch = require('../models/branch');

/*current algorithm flaws:
    If profile attributes are equally distributed (ex. all categories are at 25%). This will result in a low score. However, this actually indicates "no pref",
    and hence shouldn't be taken into account for the score calculation.

    Triangle Distribution is not very accurate (using better distribution requires changing the model and changing)

    Does not work if no postalcode/branch is provided

*/

exports.createDatingProfile = asyncHandler(async (req, res, next) => {
    //let typeProfile, categoryProfile, engineProfile, priceProfile, colourProfile, makeProfile, isAutomaticProfile;
    const {vehicleArray, startDate, endDate, branchName} = req.body;
    const newDatingProfile = new DatingProfile({
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
            min: 9999999,
            max: 0,
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
        buildDatingProfile(savedDatingProfile, vehicleArray);
        console.log("Dating Profile: "+ savedDatingProfile);
    } catch (e){
        res.status(400).send({ message: 'Could not update dating profile.' }); 
    }
    
    const [matchedVehicle, highestScore] = await matchDate(savedDatingProfile, startDate, endDate, branchName);
    res.send({matchedVehicle, highestScore});
});

async function buildDatingProfile(datingProfile, vehicleArray) {
    for (var i = 0; i < vehicleArray.length; i++) {
        const incrementNumber = 1/vehicleArray.length*100;

        datingProfile.categoryProfile[vehicleArray[i].category] += incrementNumber;
        datingProfile.typeProfile[vehicleArray[i].type] += incrementNumber;
        datingProfile.engineProfile[vehicleArray[i].details.engineType] += incrementNumber;
        
        //All my homies loves embedded maps as documents :)
        const colourKey = vehicleArray[i].details.colour;
        const colourValue = datingProfile.colourProfile.get(colourKey);
        const colorMap = datingProfile.colourProfile;
        colorMap.has(colourKey) ? colorMap.set(colourKey, colourValue +incrementNumber) : colorMap.set(colourKey, incrementNumber);

        const makeKey = vehicleArray[i].details.make;
        const makeValue = datingProfile.makeProfile.get(makeKey);
        const makeMap = datingProfile.makeProfile
        makeMap.has(makeKey) ? makeMap.set(makeKey, makeValue +incrementNumber) : makeMap.set(makeKey, incrementNumber);


        if(vehicleArray[i].dailyPrice> datingProfile.priceProfile.max){
            datingProfile.priceProfile.max=vehicleArray[i].dailyPrice;
        }
        if(vehicleArray[i].dailyPrice< datingProfile.priceProfile.min){
           datingProfile.priceProfile.min=vehicleArray[i].dailyPrice;
        }
        datingProfile.priceProfile.avg += vehicleArray[i].dailyPrice/vehicleArray.length;

        if(vehicleArray[i].details.isAutomatic){
            datingProfile.isAutomaticProfile += incrementNumber; 
        }
    
    }
    await datingProfile.save();
    return true;
}


async function matchDate(datingProfile, startDate, endDate, branchName){
    const matchRate = 0;
    //console.log("Before findAvailableVehicles");
    const availableVehicles = await findAvailableVehicles(startDate, endDate, branchName);
    //console.log("After Available vehicles");
    var highestScore = 0;
    var matchedvehicle;
    availableVehicles.forEach((vehicle) =>{
        console.log("Make: " +vehicle.details.make);  //calculates the score for each vehicle. Can reduce scope of availableVehicles by first filtering for strict preferences (ie colour MUST be red)
            let score = calculateMatchScore(vehicle, datingProfile);
            if(score>highestScore){
                highestScore = score;
                matchedvehicle = vehicle;
            }
    }
    );
    // for(const vehicle in availableVehicles){
    //     console.log(vehicle.details.make);  //calculates the score for each vehicle. Can reduce scope of availableVehicles by first filtering for strict preferences (ie colour MUST be red)
    //     let score = calculateMatchScore(vehicle, datingProfile);
    //     if(score>highestScore){
    //         highestScore = score;
    //         matchedvehicle = vehicle;
    //     }
    // }
    return [matchedvehicle, highestScore];
}

/**
 * @param {Vehicle} vehicle
 * @param {datingProfile} datingProfile
 */
function calculateMatchScore(vehicle, datingProfile){
    let score = 0;
    //logic here
    console.log("Calculating Match Score");
    const categoryScore = eval("datingProfile.categoryProfile." + vehicle.category); //Need to fix "full-size"
    console.log("Category Score: "+categoryScore);
    const typeScore = eval("datingProfile.typeProfile." + vehicle.type);
    console.log("Type Score: "+typeScore);
    const engineScore = eval("datingProfile.engineProfile." + vehicle.details.engineType);
    console.log("Engine Score: "+engineScore);
    const colourScore = datingProfile.colourProfile.get(vehicle.details.colour); //To see if implement colour distance algorithm
    if(colourScore=="null"){  //null or undefined
        colourScore=0;
    }
    console.log("Colour Score: "+colourScore);
    const makeScore = datingProfile.makeProfile.get(vehicle.details.make);
    if(makeScore=="null"){ //null or undefined
        makeScore=0;
    }
    console.log("Make Score: "+makeScore);
    const isAutomaticScore = datingProfile.isAutomaticProfile;
    console.log("Automatic Score: "+isAutomaticScore);
    const priceScore = calculatePriceScore(vehicle, datingProfile);
    console.log("Price Score: "+priceScore);

    let totalScore = (categoryScore + typeScore+ engineScore+ makeScore + isAutomaticScore +priceScore)/6;
    console.log("Total Score: "+totalScore);
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
    console.log("Calculating Price Score")
    const min = datingProfile.priceProfile.min;
    const max = datingProfile.priceProfile.max;
    const peak = datingProfile.priceProfile.avg;
    const vehiclePrice = vehicle.dailyPrice;
    console.log("min: " +min)
    console.log("max: " +max)
    console.log("peak: " +peak)
    console.log("vehicle Price: " +vehiclePrice);
    const scoreFactor = 50*(max-min); //Multiplication factor to get scores ranging from 0-100, where 100 if price=average=peak
    var PDF =0; // If outside bounds, PDF = 0
    //Triangle distribution PDF computation
    if(min<vehiclePrice && vehiclePrice<=peak){
        PDF=2*(vehiclePrice-min)/((max-min)*(peak-min));
        console.log("Case 1");
    }else if(peak< vehiclePrice && vehiclePrice <max){
        PDF=2*(max-vehiclePrice)/((max-min)*(max-peak));
        console.log("Case 2");
    }
    console.log("PDF = " +PDF);
    return PDF*scoreFactor;
}


async function findAvailableVehicles(startDate, endDate, branchName) {
    //Not sure if there is a better way of doing this by calling vehicleController.readAvailableVehicles so doing this for now

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
    // const branch= await Branch.findOne({name: 'Montreal Branch'});
    const branch= await Branch.findOne({name: branchName});
    console.log("branch name: "+ branch.name);
    // Find available vehicles that do not have reservations in the given date range
    const availableVehicles = await Vehicle.find(
        {
            _id: { $nin: reservedVehicleIds },
            branch: branch._id
        }
    );
    if(availableVehicles == "null"){
        console.log("Available vehicles is null or undefined");
    }else if(Object.keys(availableVehicles).length === 0){
        console.log("Available vehicles is empty")
    }
    else{
        console.log("Available vehicles is defined");
        console.log("There are " +availableVehicles.length +" available vehicles");   
    }

    return availableVehicles;

    // If we want to sort by branch, we can uncomment this underneath and replace availableVehicles with filteredVehicles
    // const filteredVehicles = availableVehicles.vehicles.filter(vehicle => vehicle.branch.name === branchName);

    // Shuffle the available vehicles 
    const shuffledVehicles = availableVehicles.sort(() => Math.random() - 0.5);

    // Return the first 10 vehicles as the random selection
    const randomVehicles = shuffledVehicles.slice(0, 10);

    return randomVehicles;
}
exports.datingDashboard = asyncHandler(async (req, res, next) => {
    res.render('dating/start');
});
