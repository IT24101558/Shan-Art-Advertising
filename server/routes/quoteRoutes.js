const express = require('express');
const { generateQuote, getQuoteById, approveQuote, deleteQuote, getAllQuotes } = require('../controllers/quoteController.js');

const router = express.Router();

router.route('/')
    .get(getAllQuotes);
router.route('/generate')
    .post(generateQuote);
router.route('/:id')
    .get(getQuoteById)
    .delete(deleteQuote);
router.route('/:id/approve')
    .put(approveQuote);

module.exports = router;
