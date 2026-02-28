const Quote = require('../models/Quote.js');
const { getRiskScoreAndMultiplier } = require('../services/aiMockService.js');
const { calculateTotals } = require('../services/pricingService.js');

// @desc    Generate a new quote
// @route   POST /api/quotes/generate
// @access  Private
exports.generateQuote = async (req, res) => {
    try {
        const { customerId, orderId, materials, laborCost, machineCost, discount } = req.body;

        const aiRisk = await getRiskScoreAndMultiplier(orderId);

        const processedMaterials = materials.map(m => ({
            ...m,
            totalPrice: m.quantity * m.unitPrice
        }));

        const pricing = calculateTotals(processedMaterials, laborCost, machineCost, 0.15, discount, aiRisk.multiplier);

        const quoteNumber = `QT-${Date.now()}`;

        const quote = await Quote.create({
            quoteNumber,
            customerId,
            orderId,
            materials: processedMaterials,
            laborCost,
            machineCost,
            subtotal: pricing.subtotal,
            tax: pricing.tax,
            discount: pricing.discount,
            totalAmount: pricing.totalAmount,
            riskMultiplier: aiRisk.multiplier,
            status: 'Draft',
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });

        res.status(201).json({
            success: true,
            data: quote,
            riskAnalysis: aiRisk
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single quote
// @route   GET /api/quotes/:id
// @access  Private
exports.getQuoteById = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });
        res.status(200).json({ success: true, data: quote });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Approve quote
// @route   PUT /api/quotes/:id/approve
// @access  Private
exports.approveQuote = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

        quote.status = 'Approved';
        await quote.save();

        res.status(200).json({ success: true, data: quote });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete quote
// @route   DELETE /api/quotes/:id
// @access  Private
exports.deleteQuote = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

        await quote.deleteOne();
        res.status(200).json({ success: true, message: 'Quote deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Private
exports.getAllQuotes = async (req, res) => {
    try {
        const quotes = await Quote.find().sort('-createdAt');
        res.status(200).json({ success: true, count: quotes.length, data: quotes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
