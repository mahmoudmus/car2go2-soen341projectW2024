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

    pickupLocation: { type: Schema.Types.ObjectId, ref: 'Branch' },
    dropoffLocation: { type: Schema.Types.ObjectId, ref: 'Branch' },
    status: { type: String, default: 'Pending' },
    accessories: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Accessory',
        },
    ],
});

reservationSchema.virtual('cost').get(function () {
    if (this.vehicle && this.vehicle.dailyPrice) {
        const days = Math.floor(
            (this.endDate - this.startDate) / (1000 * 60 * 60 * 24)
        );
        const totalCost = days * this.vehicle.dailyPrice;
        return Math.round(totalCost * 100) / 100;
    }
    return null;
});

reservationSchema.set('toJSON', { virtuals: true });
reservationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Reservation', reservationSchema);
