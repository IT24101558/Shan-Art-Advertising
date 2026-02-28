import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calculator, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { quoteAPI } from '../../services/api';

const MOCK_INVENTORY = [
    { id: '1', name: 'Glossy Paper A4', unitPrice: 0.50 },
    { id: '2', name: 'Matte Paper A3', unitPrice: 1.20 },
    { id: '3', name: 'Vinyl Banner Material (sq ft)', unitPrice: 2.50 },
    { id: '4', name: 'Business Card Cardstock', unitPrice: 0.10 },
    { id: '5', name: 'Premium Ink Cartridge (per ml)', unitPrice: 0.80 },
];

export default function QuoteGenerator() {
    const [materials, setMaterials] = useState([]);
    const [laborCost, setLaborCost] = useState(0);
    const [machineCost, setMachineCost] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [quoteResult, setQuoteResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Live preview calculations
    const materialsSubtotal = materials.reduce((acc, m) => acc + (m.quantity * (m.unitPrice || 0)), 0);
    const liveSubtotal = materialsSubtotal + Number(laborCost) + Number(machineCost);
    const liveTax = liveSubtotal * 0.15;
    const liveTotal = liveSubtotal + liveTax - Number(discount);

    const addMaterial = (item) => {
        setMaterials([...materials, { ...item, quantity: 1 }]);
    };

    const removeMaterial = (index) => {
        setMaterials(materials.filter((_, i) => i !== index));
    };

    const updateQuantity = (index, qty) => {
        const newM = [...materials];
        newM[index].quantity = qty;
        setMaterials(newM);
    };

    const handleGenerate = async () => {
        if (materials.length === 0) {
            setError('Please add at least one material.');
            return;
        }
        setError('');
        setLoading(true);

        try {
            const payload = {
                customerId: null, // placeholder
                orderId: null, // placeholder
                materials,
                laborCost,
                machineCost,
                discount
            };

            const { data } = await quoteAPI.generate(payload);
            setQuoteResult(data);
        } catch (err) {
            setError('Failed to generate quote. Please check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quote Generator</h1>
                    <p className="text-slate-500 mt-1">Create estimates with live AI delay risk analysis.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Calculator className="w-5 h-5" />}
                    Generate Formal Quote
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {quoteResult && (
                <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-6 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="bg-green-100 p-3 rounded-full h-fit">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-900">Quote Generated Successfully</h3>
                                <p className="text-green-700">Quote Number: <span className="font-bold">{quoteResult.data.quoteNumber}</span></p>
                                <div className="mt-4 space-y-2 text-sm text-green-800">
                                    <p>Subtotal: ${quoteResult.data.subtotal.toFixed(2)}</p>
                                    <p>Tax: ${quoteResult.data.tax.toFixed(2)}</p>
                                    <p className="font-bold text-lg text-green-900 mt-2">Total: ${quoteResult.data.totalAmount.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {quoteResult.riskAnalysis && (
                            <div className={`p-4 rounded-lg border max-w-xs ${quoteResult.riskAnalysis.riskLevel === 'HIGH' ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
                                <h4 className={`font-semibold text-sm mb-1 flex items-center gap-2 ${quoteResult.riskAnalysis.riskLevel === 'HIGH' ? 'text-orange-800' : 'text-blue-800'}`}>
                                    {quoteResult.riskAnalysis.riskLevel === 'HIGH' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                    AI Risk Analysis
                                </h4>
                                <p className="text-xs text-slate-600">{quoteResult.riskAnalysis.description}</p>
                                {quoteResult.riskAnalysis.riskLevel === 'HIGH' && (
                                    <p className="text-xs font-bold text-orange-700 mt-2">10% Risk Premium Applied</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Input Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary-500" /> Materials from Inventory
                        </h2>

                        <div className="mb-4">
                            <select
                                className="w-full border-slate-300 rounded-lg p-3 text-slate-700 bg-slate-50 focus:ring-primary-500 focus:border-primary-500"
                                onChange={(e) => {
                                    const item = MOCK_INVENTORY.find(i => i.id === e.target.value);
                                    if (item) addMaterial(item);
                                    e.target.value = "";
                                }}
                                defaultValue=""
                            >
                                <option value="" disabled>+ Add Material...</option>
                                {MOCK_INVENTORY.map(item => (
                                    <option key={item.id} value={item.id}>{item.name} - ${item.unitPrice.toFixed(2)}</option>
                                ))}
                            </select>
                        </div>

                        {materials.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                                        <th className="pb-2 font-medium">Material</th>
                                        <th className="pb-2 font-medium">Qty</th>
                                        <th className="pb-2 font-medium">Price</th>
                                        <th className="pb-2 font-medium">Total</th>
                                        <th className="pb-2"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {materials.map((m, idx) => (
                                        <tr key={idx}>
                                            <td className="py-3 text-slate-700">{m.name}</td>
                                            <td className="py-3">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={m.quantity}
                                                    onChange={(e) => updateQuantity(idx, Number(e.target.value))}
                                                    className="w-16 p-1 border rounded text-center"
                                                />
                                            </td>
                                            <td className="py-3 text-slate-600">${m.unitPrice.toFixed(2)}</td>
                                            <td className="py-3 font-medium text-slate-800">${(m.quantity * m.unitPrice).toFixed(2)}</td>
                                            <td className="py-3 text-right">
                                                <button onClick={() => removeMaterial(idx)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-md transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
                                No materials selected
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Labor Cost ($)</label>
                            <input
                                type="number"
                                value={laborCost}
                                onChange={e => setLaborCost(e.target.value)}
                                className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Machine Usage Cost ($)</label>
                            <input
                                type="number"
                                value={machineCost}
                                onChange={e => setMachineCost(e.target.value)}
                                className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Discount Amount ($)</label>
                            <input
                                type="number"
                                value={discount}
                                onChange={e => setDiscount(e.target.value)}
                                className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Live Preview Column */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 rounded-xl shadow-lg p-6 text-white sticky top-8">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
                            <Calculator className="w-5 h-5 text-primary-400" /> Live Estimate
                        </h2>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between text-slate-400">
                                <span>Materials</span>
                                <span>${materialsSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Labor</span>
                                <span>${Number(laborCost).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Machine</span>
                                <span>${Number(machineCost).toFixed(2)}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-700 flex justify-between font-medium">
                                <span>Subtotal</span>
                                <span>${liveSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400">
                                <span>Tax (15%)</span>
                                <span>${liveTax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-red-400">
                                <span>Discount</span>
                                <span>-${Number(discount).toFixed(2)}</span>
                            </div>

                            <div className="pt-4 mt-4 border-t border-slate-700">
                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-medium">Total</span>
                                    <span className="text-3xl font-bold text-primary-400">${(liveTotal > 0 ? liveTotal : 0).toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-slate-500 text-right mt-1">Excludes potential AI risk factors</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
