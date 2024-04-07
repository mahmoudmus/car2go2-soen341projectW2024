const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DatingSchema = new Schema({
    // All values are numbers from 0-100 representing the match percentage
    categoryProfile: {
        compact: Number,
        standard: Number,
        intermediate: Number,
        fullsize: Number,
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

DatingSchema.methods.findStrictPrefs = async function () { //unused as of now
    const strictPrefs = [];
    this.find({ $where: function(){
        for(var key in this){
            if(this[key] === "100"){
                strictPrefs.push(key);
            }
        }
    }
    })
    return strictPrefs;
};

module.exports = mongoose.model('DatingProfile', DatingSchema);