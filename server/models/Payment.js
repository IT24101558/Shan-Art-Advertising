const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Bank Transfer', 'Stripe', 'Other'],
        required: true
    },
    transactionId: {
        type: String
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
