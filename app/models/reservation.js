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
    pickup_location_id: { type: String },
    dropoff_location_id: { type: String },
    status: { type: String, default: 'Pending' },
});

reservationSchema.virtual('cost').get(function () {
    if (this.vehicle && this.vehicle.dailyPrice) {
        const days = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
        const totalCost = days * this.vehicle.dailyPrice;
        return Math.round(totalCost * 100) / 100;
    }
    return null;
});

reservationSchema.set('toJSON', { virtuals: true });
reservationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Reservation', reservationSchema);
