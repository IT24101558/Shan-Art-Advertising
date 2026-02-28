import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { invoiceAPI } from '../../services/api';

export default function AnalyticsDashboard() {
    const [report, setReport] = useState([]);
    const [stats, setStats] = useState({ totalSales: 0, totalPaid: 0, totalOutstanding: 0 });

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const year = new Date().getFullYear();
            const { data } = await invoiceAPI.getMonthlyReport(year);
            if (data.data) {
                setReport(data.data);

                // Calculate totals from report array
                const ts = data.data.reduce((acc, curr) => acc + curr.totalSales, 0);
                const tp = data.data.reduce((acc, curr) => acc + curr.totalPaid, 0);
                const to = data.data.reduce((acc, curr) => acc + curr.totalOutstanding, 0);

                setStats({ totalSales: ts, totalPaid: tp, totalOutstanding: to });
            }
        } catch (error) {
            console.error("Failed to fetch analytics");
        }
    };

    const kpis = [
        { title: 'Total Revenue YTD', value: `$${stats.totalSales.toFixed(2)}`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Collected Payments', value: `$${stats.totalPaid.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Outstanding Balance', value: `$${stats.totalOutstanding.toFixed(2)}`, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sales & Analytics</h1>
                <p className="text-slate-500 mt-1">Key performance indicators and revenue analysis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className={`p-4 rounded-full ${kpi.bg}`}>
                            <kpi.icon className={`w-8 h-8 ${kpi.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2">Monthly Revenue</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={report}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="totalSales" fill="#0ea5e9" radius={[4, 4, 0, 0]} name="Total Sales" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2">Outstanding vs Paid Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={report}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B' }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="totalPaid" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Paid" />
                                <Line type="monotone" dataKey="totalOutstanding" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Outstanding" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
