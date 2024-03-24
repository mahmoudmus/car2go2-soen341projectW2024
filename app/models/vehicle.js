const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
    category: {
        type: String,
        enum: ['compact', 'standard', 'intermediate', 'full-size'],
        required: true,
        lowercase: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['car', 'suv', 'van', 'truck'],
        required: true,
        lowercase: true,
        trim: true,
    },
    imageUrl: {
        type: String,
        trim: true,
    },
    dailyPrice: { type: Number, required: true, min: 0 },
    branch: {
        type: Schema.Types.ObjectId,
        ref: 'Branch',
        required: true,
    },
    details: {
        make: String, // Car manufacturer
        model: String, // Car model
        year: Number, // Car year
        colour: String,
        seats: Number, // Max number of passengers
        doors: Number,
        mileage: Number, // In km
        isAutomatic: Boolean,
        engineType: {
            type: String,
            enum: ['gas', 'electric', 'hybrid'],
            lowercase: true,
            trim: true,
        },
    },
    licensePlateNumber: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        match: /^[EKLMNPRTUVWXYZ]{3} \d{2}[ABCDEFGHIJKLMNOPQRSTUVWXYZ]$/,
    },
});

VehicleSchema.methods.verifyPriceRange = function (price) {
    //returns price range minimum. Maximum is min+5
    switch (price) {
        case price >= 20 && price <= 25:
            return 20;
        case price >= 25 && price <= 30:
            return 25;
        case price >= 30 && price <= 35:
            return 30;
        case price >= 35 && price <= 40:
            return 35;
    }
};
VehicleSchema.methods.verifySizeRange = function (price) {
    //returns size range minimum. Maximum is min+500.
    switch (size) {
        case price <= 1000:
            return 0;
        case price >= 1000 && price <= 1500:
            return 1000;
        case price >= 1500 && price <= 2000:
            return 1500;
        case price >= 2000 && price <= 2500:
            return 2000;
        case price >= 2500:
            return -1;
    }
};

module.exports = mongoose.model('Vehicle', VehicleSchema);
