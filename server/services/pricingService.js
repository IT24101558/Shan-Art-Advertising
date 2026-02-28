/**
 * Service to handle pricing calculations for quotes and invoices
 */

const calculateTotals = (materials, laborCost, machineCost, taxRate = 0.15, discount = 0, riskMultiplier = 1.0) => {
    let materialsTotal = 0;
    if (materials && materials.length > 0) {
        materialsTotal = materials.reduce((sum, item) => sum + (item.totalPrice || (item.quantity * item.unitPrice)), 0);
    }

    const baseSubtotal = materialsTotal + Number(laborCost || 0) + Number(machineCost || 0);
    const riskAdjustedSubtotal = baseSubtotal * Number(riskMultiplier);
    const taxAmount = riskAdjustedSubtotal * taxRate;
    const totalAmount = riskAdjustedSubtotal + taxAmount - Number(discount || 0);

    return {
        subtotal: riskAdjustedSubtotal,
        tax: taxAmount,
        discount: Number(discount || 0),
        totalAmount: totalAmount > 0 ? totalAmount : 0
    };
};

module.exports = { calculateTotals };
