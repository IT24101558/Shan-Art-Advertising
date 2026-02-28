/**
 * Mock Service imitating the AI Delay & Risk Detection Module
 */

const getRiskScoreAndMultiplier = async (orderId) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const isHighRisk = Math.random() > 0.7;

    if (isHighRisk) {
        return {
            riskLevel: 'HIGH',
            description: 'Potential delay in supply chain detected.',
            multiplier: 1.10
        };
    }

    return {
        riskLevel: 'LOW',
        description: 'No significant risks detected.',
        multiplier: 1.00
    };
};

module.exports = { getRiskScoreAndMultiplier };
