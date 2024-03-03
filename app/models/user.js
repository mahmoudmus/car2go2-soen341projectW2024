const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true, min: 18 },
    email: {
        type: String,
        required: 'An email address is required.',
        lowercase: true,
        unique: true,
    },
    hash: { type: String, required: true },
    address: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, immutable: true },
    updatedAt: { type: Date, default: Date.now },
    type: {
        type: String,
        enum: ['customer', 'csr', 'admin'],
        required: true,
        default: 'customer',
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

UserSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.hash);
};

module.exports = mongoose.model('User', UserSchema);
