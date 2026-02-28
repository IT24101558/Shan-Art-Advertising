const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  quoteNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: false
  },
  materials: [{
    materialId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory'
    },
    name: String,
    quantity: Number,
    unitPrice: Number,
    totalPrice: Number
  }],
  laborCost: {
    type: Number,
    default: 0
  },
  machineCost: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
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
  riskMultiplier: {
    type: Number,
    default: 1.0
  },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Approved', 'Rejected'],
    default: 'Draft'
  },
  validUntil: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Quote', quoteSchema);
