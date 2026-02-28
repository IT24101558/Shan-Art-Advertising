const Payment = require('../models/Payment.js');
const Invoice = require('../models/Invoice.js');

// @desc    Record a new payment for an invoice
// @route   POST /api/payments/record
// @access  Private
exports.recordPayment = async (req, res) => {
    try {
        const { invoiceId, amount, paymentMethod, transactionId, notes } = req.body;

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

        if (amount <= 0 || amount > invoice.balanceAmount) {
            return res.status(400).json({ success: false, message: 'Invalid payment amount specified.' });
        }

        const payment = await Payment.create({
            invoiceId,
            amount,
            paymentMethod,
            transactionId,
            notes,
            recordedBy: req.user ? req.user._id : null
        });

        invoice.paidAmount += amount;
        invoice.balanceAmount -= amount;

        if (invoice.balanceAmount <= 0) {
            invoice.paymentStatus = 'Paid';
        } else {
            invoice.paymentStatus = 'Partial';
        }

        await invoice.save();

        res.status(201).json({ success: true, data: payment, invoiceStatus: invoice.paymentStatus });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all payments for a specific invoice
// @route   GET /api/payments/invoice/:invoiceId
// @access  Private
exports.getPaymentsByInvoice = async (req, res) => {
    try {
        const payments = await Payment.find({ invoiceId: req.params.invoiceId }).sort('-paymentDate');
        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().sort('-paymentDate').populate('invoiceId', 'invoiceNumber');
        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
