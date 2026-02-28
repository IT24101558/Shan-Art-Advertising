const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    quoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote'
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemBreakdown: [{
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number
    }],
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    balanceAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['Unpaid', 'Partial', 'Paid'],
        default: 'Unpaid'
    },
    dueDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
