const mongoose = require('mongoose');
const Schema = mongoose.Schema;
bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;

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
    password: { type: String, required: true },
    homeAdress: {type: AddressSchema, required: true},
    sex: {type: Number},
    createdAt: {type: Date, default: () => Date.now, immutable: true}, //cannot be modified
    updatedAt: {type: Date, default: () => Date.now},
    userType: {type: Number, default: 0 } // 0-> User, 1->CSR, 2-> admin
});

UserSchema.pre('save', function(next){  //updates updated time at every 'save'
    this.updatedAt = Date.now
    next()
})

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
     
UserSchema.methods.verifyPassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
