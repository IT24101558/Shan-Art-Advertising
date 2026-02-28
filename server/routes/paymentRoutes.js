const express = require('express');
const { recordPayment, getPaymentsByInvoice, getAllPayments } = require('../controllers/paymentController.js');

const router = express.Router();

router.route('/')
    .get(getAllPayments);
router.route('/record')
    .post(recordPayment);
router.route('/invoice/:invoiceId')
    .get(getPaymentsByInvoice);

module.exports = router;
