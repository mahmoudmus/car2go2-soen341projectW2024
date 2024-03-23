const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    amount: { type: String, required: true },
    type: {
        type: String,
        enum: ['deposit', 'payment'],
        required: true,
    },
    createdAt: { type: Date, default: Date.now, immutable: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
