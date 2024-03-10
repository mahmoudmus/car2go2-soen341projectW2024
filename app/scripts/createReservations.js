require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

const Reservation = require('../models/reservation');

const deleteAllReservations = async () => {
    try {
        const result = await Reservation.deleteMany({});
        console.log(`Deleted ${result.deletedCount} Reservation instances.`);
    } catch (error) {
        console.error('Error deleting reservation instances:', error);
    }
};

deleteAllReservations();
