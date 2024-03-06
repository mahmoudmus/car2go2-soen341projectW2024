const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    // TBD
    pickup_location_id: { type: String, required: true },
    dropoff_location_id: { type: String, required: true },
    status: { type: String, default: 'Pending' },
});

module.exports = mongoose.model('Reservation', reservationSchema);
