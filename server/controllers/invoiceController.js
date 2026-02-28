const Invoice = require('../models/Invoice.js');
const Quote = require('../models/Quote.js');

// @desc    Create an invoice from a quote (or standalone)
// @route   POST /api/invoices/create
// @access  Private
exports.createInvoice = async (req, res) => {
    try {
        const { quoteId, customerId, itemBreakdown, subtotal, tax, discount, totalAmount, dueDate } = req.body;

        let invoiceData = { customerId, itemBreakdown, subtotal, tax, discount, totalAmount, dueDate: new Date(dueDate) };

        if (quoteId) {
            const quote = await Quote.findById(quoteId);
            if (!quote) return res.status(404).json({ success: false, message: 'Quote not found' });

            const items = itemBreakdown || [{
                description: `Items for Quote ${quote.quoteNumber}`,
                quantity: 1,
                unitPrice: quote.subtotal,
                total: quote.subtotal
            }];

            invoiceData = {
                quoteId,
                customerId: quote.customerId || customerId,
                itemBreakdown: items,
                subtotal: quote.subtotal,
                tax: quote.tax,
                discount: quote.discount,
                totalAmount: quote.totalAmount,
                dueDate: new Date(dueDate || Date.now() + 14 * 24 * 60 * 60 * 1000)
            };
        }

        const invoiceNumber = `INV-${Date.now()}`;
        const invoice = await Invoice.create({
            invoiceNumber,
            ...invoiceData,
            balanceAmount: invoiceData.totalAmount
        });

        res.status(201).json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get invoices by customer
// @route   GET /api/invoices/customer/:customerId
// @access  Private
exports.getInvoicesByCustomer = async (req, res) => {
    try {
        const invoices = await Invoice.find({ customerId: req.params.customerId }).sort('-createdAt');
        res.status(200).json({ success: true, count: invoices.length, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get monthly sales report
// @route   GET /api/invoices/report/monthly
// @access  Private
exports.getMonthlyReport = async (req, res) => {
    try {
        const year = req.query.year ? parseInt(req.query.year) : new Date().getFullYear();

        const report = await Invoice.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalSales: { $sum: "$totalAmount" },
                    totalPaid: { $sum: "$paidAmount" },
                    totalOutstanding: { $sum: "$balanceAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const formattedReport = months.map((month, index) => {
            const found = report.find(r => r._id === index + 1);
            return {
                month,
                totalSales: found ? found.totalSales : 0,
                totalPaid: found ? found.totalPaid : 0,
                totalOutstanding: found ? found.totalOutstanding : 0,
                invoiceCount: found ? found.count : 0
            };
        });

        res.status(200).json({ success: true, data: formattedReport });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all active invoices
// @route   GET /api/invoices
// @access  Private
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().sort('-createdAt');
        res.status(200).json({ success: true, count: invoices.length, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
