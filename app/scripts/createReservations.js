require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URI;

main()
    .then(async () => {
        await deleteReservations();
        mongoose.connection.close();
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoDB);
}

const Reservation = require('../models/reservation');

const deleteReservations = async () => {
    try {
        const result = await Reservation.deleteMany({});
        console.log(`Deleted ${result.deletedCount} reservations.`);
    } catch (error) {
        console.error('Error deleting reservation instances:', error);
    }
};
