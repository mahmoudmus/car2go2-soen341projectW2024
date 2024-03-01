const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
    id: {type: String, required: true, default: () => nanoid(), immutable: true },
    type: {type: String, required: true },
    category: {type: String, required: true }, //suv, sport, convertible, etc
    price: {type: Number, required: true }, // price/day
    pickup_location_id: {type: String, required: true },
    make: String, //car manufacturer
    model: String, //car model
    year: Number, //car year
    colour: String,
    seats: Number, //max number of passengers
    doors: Number,
    mileage: Number, //in km
    isAutomatic: Boolean,
    engineType: String, // Gas, electric, hybrid
    size: Number //in Litres
});


VehicleSchema.methods.verifyPriceRange = function(price) { //returns price range minimum. Maximum is min+5
    switch (price) {
        case price>=20 && price<=25:
          return 20
        case price>=25 && price<=30:
          return 25
        case price>=30 && price<=35:
          return 30
        case price>=35 && price<=40:
          return 35
      }   
};
VehicleSchema.methods.verifySizeRange = function(price) { //returns size range minimum. Maximum is min+500.
    switch (size) {
        case price<=1000:
          return 0
        case price>=1000 && price<=1500:
          return 1000
        case price>=1500 && price<=2000:
          return 1500
        case price>=2000 && price<=2500:
          return 2000
        case price>=2500:
          return -1
      }   
};
module.exports = mongoose.model('Vehicle', VehicleSchema);
