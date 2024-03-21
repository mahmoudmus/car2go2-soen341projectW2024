const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accessorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    price: { type: Number, required: true, min: 0 },
});

module.exports = mongoose.model('Accessory', accessorySchema);
