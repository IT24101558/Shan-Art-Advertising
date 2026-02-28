import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import QuoteGenerator from './pages/billing/QuoteGenerator';
import InvoiceDashboard from './pages/billing/InvoiceDashboard';
import PaymentForm from './pages/billing/PaymentForm';
import AnalyticsDashboard from './pages/billing/AnalyticsDashboard';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-50 flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200">
                    <div className="h-16 flex items-center px-6 border-b border-slate-200">
                        <h1 className="text-xl font-bold text-slate-900">Shan Art Prints</h1>
                    </div>
                    <nav className="p-4 space-y-2">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Billing Module</div>
                        <Link to="/quotes" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                            Quotes
                        </Link>
                        <Link to="/invoices" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                            Invoices
                        </Link>
                        <Link to="/payments" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                            Payments
                        </Link>
                        <Link to="/analytics" className="block px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                            Analytics
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto">
                    <div className="p-8">
                        <Routes>
                            <Route path="/" element={<AnalyticsDashboard />} />
                            <Route path="/quotes" element={<QuoteGenerator />} />
                            <Route path="/invoices" element={<InvoiceDashboard />} />
                            <Route path="/payments" element={<PaymentForm />} />
                            <Route path="/analytics" element={<AnalyticsDashboard />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
