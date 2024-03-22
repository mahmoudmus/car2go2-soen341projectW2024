const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const Reservation = require('./reservation');

const UserSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    email: {
        type: String,
        required: 'An email address is required.',
        lowercase: true,
        unique: true,
    },
    address: { type: String, required: true },
    hash: { type: String, required: true },
    type: {
        type: String,
        enum: ['customer', 'csr', 'admin'],
        required: true,
        default: 'customer',
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
    billingInformation: {
        // @todo: complete this attribute.
        cardNumber: String,
        cvv: String,
    },
});

UserSchema.pre('save', function (next) {
    if (!this.isNew) {
        this.updatedAt = Date.now();
    }
    next();
});

UserSchema.pre('save', async function (next) {
    if (this.isModified('hash') || this.isNew) {
        const salt = await bcrypt.genSalt(
            parseInt(process.env.SALT_WORK_FACTOR)
        );
        this.hash = await bcrypt.hash(this.hash, salt);
    }
    next();
});

UserSchema.pre('deleteOne', async function (next) {
    var user = this;
    user.model('Reservation').deleteMany({ user: this._id }, next());
});

UserSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.hash);
};

module.exports = mongoose.model('User', UserSchema);
