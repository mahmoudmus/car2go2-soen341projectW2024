require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

const Vehicle = require('../models/vehicle');
const Branch = require('../models/branch');

const deleteAllVehicles = async () => {
    try {
        const result = await Vehicle.deleteMany({});
        console.log(`Deleted ${result.deletedCount} vehicle instances.`);
    } catch (error) {
        console.error('Error deleting vehicle instances:', error);
    }
};

const createVehicleInstances = async () => {
    const categories = ['compact', 'standard', 'intermediate', 'fullsize'];
    const types = ['car', 'suv', 'van', 'truck'];
    const makers = ['Ford', 'Toyota', 'Volkswagen'];
    const models = ['Tesla Model S', 'Ford Mustang', 'Honda Civic'];
    const randomYear = () => {
        return Math.floor(Math.random() * (2021 - 1990) + 1990);
    };
    const colors = ['black', 'grey', 'red', 'blue'];
    const chooseRandom = (arr) => {
        const randomIndex = Math.floor(Math.random() * arr.length);
        return arr[randomIndex];
    };
    const randomSeats = () => {
        return Math.floor(Math.random() * (8 - 2) + 2);
    };
    const randomDoors = () => {
        return Math.floor(Math.random() * (5 - 2) + 2);
    };
    const randomMileage = () => {
        return Math.floor(Math.random() * 1000000);
    };
    const randomBool = () => {
        return Math.random() >= 0.5;
    };
    const engineTypes = ['gas', 'electric', 'hybrid'];
    const randomHourlyPrice = () => {
        return Math.floor(Math.random() * (10 - 3) + 3);
    };
    const randomLicensePlate = () => {
        const letters = 'EKLMNPRTUVWXYZ';
        const lastLetter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetters =
            letters[Math.floor(Math.random() * letters.length)] +
            letters[Math.floor(Math.random() * letters.length)] +
            letters[Math.floor(Math.random() * letters.length)];
        let randomNumbers = Math.floor(Math.random() * 100);
        if (randomNumbers < 10) {
            randomNumbers = '0' + randomNumbers;
        }
        const randomLastLetter =
            lastLetter[Math.floor(Math.random() * lastLetter.length)];
        const licensePlate = `${randomLetters} ${randomNumbers}${randomLastLetter}`;
        return licensePlate;
    };
    const branches = await Branch.find({}, '_id');
    const imageUrls = [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhcnN8ZW58MHx8MHx8fDA%3D',
        'https://di-uploads-pod44.dealerinspire.com/nyetoyota/uploads/2023/09/Toyota-Sequoia-Capstone-23-1.jpg',
        'https://hips.hearstapps.com/hmg-prod/images/2023-chevrolet-bolt-ev-003-1669921570.jpg?crop=0.500xw:0.500xh;0.352xw,0.380xh&resize=980:*',
        'https://www.autocar.co.uk/sites/autocar.co.uk/files/styles/gallery_slide/public/images/car-reviews/first-drives/legacy/rolls_royce_phantom_top_10.jpg?itok=XjL9f1tx',
        'https://www.motortrend.com/uploads/2022/08/2022-Bugatti-Chiron-Super-Sport-2-1.jpg',
        'https://robbreport.com/wp-content/uploads/2023/09/RR_50_Most_Expensive_Cars_You_Can_Buy_Right_Now_Cadillac_Celestiq.jpg?w=800',
        'https://americancollectors.com/wp-content/uploads/1st-article-photo-1-690x370-1.jpg',
    ];
    try {
        for (let i = 1; i <= 25; i++) {
            const vehicle = new Vehicle({
                category: chooseRandom(categories),
                type: chooseRandom(types),
                details: {
                    make: chooseRandom(makers),
                    model: chooseRandom(models),
                    year: randomYear(),
                    colour: chooseRandom(colors),
                    seats: randomSeats(),
                    doors: randomDoors(),
                    mileage: randomMileage(),
                    isAutomatic: randomBool(),
                    engineType: chooseRandom(engineTypes),
                },
                dailyPrice: randomHourlyPrice(),
                branch: chooseRandom(branches),
                imageUrl: chooseRandom(imageUrls),
                licensePlateNumber: randomLicensePlate(),
            });

            await vehicle.save();
            console.log(`Vehicle ${i} created.`);
        }
    } catch (error) {
        console.error('Error creating vehicle:', error);
    } finally {
        mongoose.connection.close();
    }
};

deleteAllVehicles();
createVehicleInstances();
