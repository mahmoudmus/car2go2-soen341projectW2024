const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    id: { type: String, required: true, maxLength: 20 },
    vehicle_id: { type: String, required: true, maxLength: 20 },
    user_id: {type: String, required: true, maxLength: 20 },
    start_time: { type: Date, required: true, default: Date.now },
    end_time: { type: Date, required: true, default: Date.now },
    // TBD
    pickup_location_id: {type: String, required: true },
    dropoff_location_id: {type: String, required: true },
    status: {type: String, default: 'Pending'}
});

module.exports = mongoose.model('Reservation', reservationSchema);
