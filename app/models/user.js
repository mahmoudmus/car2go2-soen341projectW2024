const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = new Schema({
    // Temporary, will want to connect with API for adresses
    street: {type: String},
    city: {type: String},
    postalCode: {type: String},
    
})
const UserSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    age: { type: Number, required: true, min: 18 , max: 100}, //Can change minimum. Must look into laws about minimum age to rent and drive a car
    email: {type: String, required: 'An email address is required', lowercase: true, unique: true }, //Must implement email confirmation system
    homeAdress: {type: AddressSchema, required: true},
    sex: {type: Number},
    createdAt: {type: Date, default: () => Date.now, immutable: true},
    updatedAt: {type: Date, default: () => Date.now}
});

UserSchema.pre('save', function(next){
    this.updatedAt = Date.now
    next()
})

module.exports = mongoose.model('User', UserSchema);
