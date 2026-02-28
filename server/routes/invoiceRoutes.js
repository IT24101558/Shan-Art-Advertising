const express = require('express');
const { createInvoice, getInvoiceById, getInvoicesByCustomer, getMonthlyReport, getAllInvoices } = require('../controllers/invoiceController.js');

const router = express.Router();

router.route('/')
    .get(getAllInvoices);
router.route('/create')
    .post(createInvoice);
router.route('/report/monthly')
    .get(getMonthlyReport);
router.route('/:id')
    .get(getInvoiceById);
router.route('/customer/:customerId')
    .get(getInvoicesByCustomer);

module.exports = router;
