const generateInvoice = (order) => {
    // Logic to generate PDF invoice
    console.log(`Generating invoice for order ${order._id}`);
    return "invoice.pdf";
};

module.exports = { generateInvoice };
