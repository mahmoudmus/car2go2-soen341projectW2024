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
    cost: { type: Number, required: true },
});

reservationSchema.virtual('duration').get(function () {
    return (this.endDate - this.startDate)/(1000 * 60 * 60 * 24);
});

reservationSchema.set('toJSON', { virtuals: true });
reservationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Reservation', reservationSchema);
