require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

const Vehicle = require('../models/vehicle');

const deleteAllVehicles = async () => {
    try {
        const result = await Vehicle.deleteMany({});
        console.log(`Deleted ${result.deletedCount} vehicle instances.`);
    } catch (error) {
        console.error('Error deleting vehicle instances:', error);
    }
};

const createVehicleInstances = async () => {
    const categories = ['compact', 'standard', 'intermediate', 'full-size'];
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
    const branches = ['downtown', 'laval', 'south shore'];
    const imageUrls = [
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNhcnN8ZW58MHx8MHx8fDA%3D',
        'https://di-uploads-pod44.dealerinspire.com/nyetoyota/uploads/2023/09/Toyota-Sequoia-Capstone-23-1.jpg',
        'https://hips.hearstapps.com/hmg-prod/images/2023-chevrolet-bolt-ev-003-1669921570.jpg?crop=0.500xw:0.500xh;0.352xw,0.380xh&resize=980:*',
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
                available: randomBool(),
                hourlyPrice: 50,
                branch: chooseRandom(branches),
                imageUrl: chooseRandom(imageUrls),
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
