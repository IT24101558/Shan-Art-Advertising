const { calculateTotals } = require('../../services/pricingService');

describe('Pricing Service - calculateTotals', () => {
    it('should correctly calculate subtotal, tax, and total', () => {
        const materials = [
            { name: 'Paper', quantity: 100, unitPrice: 0.10, totalPrice: 10.00 }
        ];
        const labor = 50;
        const machine = 20;
        const taxRate = 0.15;

        const result = calculateTotals(materials, labor, machine, taxRate);

        expect(result.subtotal).toBe(80); // 10 + 50 + 20
        expect(result.tax).toBe(12); // 80 * 0.15
        expect(result.discount).toBe(0);
        expect(result.totalAmount).toBe(92); // 80 + 12
    });

    it('should correctly apply discount and risk multiplier', () => {
        const materials = [
            { name: 'Banner', quantity: 2, unitPrice: 20, totalPrice: 40 }
        ];
        const labor = 100;
        const machine = 60;
        const taxRate = 0.15;
        const discount = 30;
        const riskMultiplier = 1.10; // 10% risk markup

        const result = calculateTotals(materials, labor, machine, taxRate, discount, riskMultiplier);

        const baseSubtotal = 40 + 100 + 60; // 200
        const expectedSubtotal = 200 * 1.10; // 220
        const expectedTax = 220 * 0.15; // 33
        const expectedTotal = 220 + 33 - 30; // 223

        expect(result.subtotal).toBeCloseTo(expectedSubtotal, 2);
        expect(result.tax).toBeCloseTo(expectedTax, 2);
        expect(result.discount).toBe(30);
        expect(result.totalAmount).toBeCloseTo(expectedTotal, 2);
    });
});
