import React, { useState, useEffect } from 'react';
import { FileText, Download, Clock, CheckCircle, ChevronRight, XCircle } from 'lucide-react';
import { invoiceAPI } from '../../services/api';

export default function InvoiceDashboard() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const { data } = await invoiceAPI.getAll();
            setInvoices(data.data || []);
        } catch (error) {
            console.error("Failed to fetch invoices", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Paid': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3" /> Paid</span>;
            case 'Partial': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1 w-fit"><Clock className="w-3 h-3" /> Partial</span>;
            case 'Unpaid': return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" /> Unpaid</span>;
            default: return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Invoices</h1>
                    <p className="text-slate-500 mt-1">Manage and track customer billing</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading invoices...</div>
                ) : invoices.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No Invoices Found</h3>
                        <p className="text-slate-500 mt-1">Approve a quote to automatically generate an invoice.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice / Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Balance</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoices.map((inv) => (
                                    <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{inv.invoiceNumber}</div>
                                            <div className="text-xs text-slate-500 mt-1">{new Date(inv.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            ${inv.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-900">
                                            ${inv.balanceAmount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(inv.paymentStatus)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-primary-600 hover:text-primary-700 p-2 rounded-md hover:bg-primary-50 transition-colors inline-flex items-center gap-1 text-sm font-medium">
                                                <Download className="w-4 h-4" /> PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
