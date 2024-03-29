const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DatingSchema = new Schema({
    categoryProfile: {
        compact: Number,
        standard: Number,
        intermediate: Number,
        fullSize: Number
    },

    typeProfile: {
        car: Number,
        suv: Number,
        van: Number,
        truck: Number
    },

    engineProfile: {
        gas: Number,
        electric: Number,
        hybrid: Number
    },

    priceProfile:{
        min: Number,
        max: Number,
        avg: Number
    },

    colourProfile:{
        type: Map,
        of: Number,

    },

    makeProfile:{
        type: Map,
        of: Number,
    },

    isAutomaticProfile: Number,
    
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

module.exports = mongoose.model('DatingProfile', DatingSchema);