const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BranchSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    location: {
        type: [Number],
        index: '2dsphere',
        required: true,
    },
});

module.exports = mongoose.model('Branch', BranchSchema);
