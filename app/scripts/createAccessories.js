require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main()
    .then(async () => {
        await deleteAccessories();
        await createAccessories();
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoDB);
}

const Accessory = require('../models/accessory');

const deleteAccessories = async () => {
    try {
        const result = await Accessory.deleteMany({});
        console.log(`Deleted ${result.deletedCount} accessories.`);
    } catch (error) {
        console.error('Error deleting accessory instances:', error);
    }
};

const createAccessories = async () => {
    const accessories = [
        {
            name: 'GPS Navigation System',
            price: 10,
        },
        {
            name: 'Roof Rack',
            price: 25,
        },
        {
            name: 'Ski Rack',
            price: 20,
        },
        {
            name: 'Child Safety Seat',
            price: 20,
        },
        {
            name: 'Car Seat Covers',
            price: 8,
        },
        {
            name: 'Insurance',
            price: 45,
        },
    ];
    try {
        for (const accessory of accessories) {
            await new Accessory(accessory).save();
            console.log(`${accessory.name} created.`);
        }
    } catch (error) {
        console.error('Error creating accessory:', error);
    } finally {
        mongoose.connection.close();
    }
};
