import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Search, CheckCircle } from 'lucide-react';
import { paymentAPI, invoiceAPI } from '../../services/api';

export default function PaymentForm() {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('Cash');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchUnpaidInvoices();
    }, [success]); // Re-fetch when payment succeeds

    const fetchUnpaidInvoices = async () => {
        try {
            const { data } = await invoiceAPI.getAll();
            const unpaid = (data.data || []).filter(i => i.paymentStatus !== 'Paid');
            setInvoices(unpaid);
        } catch (error) {
            console.error("Failed to fetch invoices");
        }
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();
        if (!selectedInvoice || !amount) return;

        setLoading(true);
        try {
            await paymentAPI.record({
                invoiceId: selectedInvoice._id,
                amount: Number(amount),
                paymentMethod: method,
                notes: "Recorded via Dashboard"
            });
            setSuccess(true);
            setAmount('');
            setSelectedInvoice(null);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            alert("Error recording payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Record Payment</h1>
                <p className="text-slate-500 mt-1">Settle outstanding balances for open invoices.</p>
            </div>

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Payment recorded successfully!
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-200 p-4 bg-slate-50 flex items-center gap-3">
                        <Search className="w-5 h-5 text-slate-400" />
                        <h3 className="font-medium text-slate-700">Select Pending Invoice</h3>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                        {invoices.length === 0 ? (
                            <p className="p-6 text-center text-slate-500 text-sm">No pending invoices found.</p>
                        ) : (
                            invoices.map(inv => (
                                <div
                                    key={inv._id}
                                    onClick={() => { setSelectedInvoice(inv); setAmount(inv.balanceAmount); }}
                                    className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${selectedInvoice?._id === inv._id ? 'bg-primary-50 border-l-4 border-primary-500' : 'border-l-4 border-transparent'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">{inv.invoiceNumber}</h4>
                                            <p className="text-xs text-slate-500">Balance: <span className="text-red-600 font-medium">${inv.balanceAmount.toFixed(2)}</span></p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-slate-700">Total: ${inv.totalAmount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <form onSubmit={handleRecordPayment} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
                        <div className="flex items-center gap-3 mb-2 pb-4 border-b border-slate-100">
                            <CreditCard className="w-6 h-6 text-primary-500" />
                            <h3 className="text-lg font-medium text-slate-800">Payment Details</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Target Invoice</label>
                            <input
                                type="text"
                                readOnly
                                value={selectedInvoice ? `${selectedInvoice.invoiceNumber} (Balance: $${selectedInvoice.balanceAmount})` : 'Select an invoice...'}
                                className="w-full border-slate-300 rounded-lg p-3 bg-slate-100 text-slate-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                            <select
                                value={method}
                                onChange={e => setMethod(e.target.value)}
                                className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Amount to Pay ($)</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="number"
                                    step="0.01"
                                    max={selectedInvoice?.balanceAmount || 0}
                                    required
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    disabled={!selectedInvoice}
                                    className="w-full pl-10 border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!selectedInvoice || loading}
                            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Record Payment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
