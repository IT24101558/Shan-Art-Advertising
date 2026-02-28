import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const quoteAPI = {
    generate: (data) => api.post('/quotes/generate', data),
    getById: (id) => api.get(`/quotes/${id}`),
    approve: (id) => api.put(`/quotes/${id}/approve`),
    getAll: () => api.get('/quotes'),
};

export const invoiceAPI = {
    create: (data) => api.post('/invoices/create', data),
    getById: (id) => api.get(`/invoices/${id}`),
    getByCustomer: (customerId) => api.get(`/invoices/customer/${customerId}`),
    getMonthlyReport: (year) => api.get(`/invoices/report/monthly?year=${year || ''}`),
    getAll: () => api.get('/invoices'),
};

export const paymentAPI = {
    record: (data) => api.post('/payments/record', data),
    getByInvoice: (invoiceId) => api.get(`/payments/invoice/${invoiceId}`),
    getAll: () => api.get('/payments'),
};

export default api;
