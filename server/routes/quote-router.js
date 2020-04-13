const express = require('express');

const QuoteCtrl = require('../controllers/quote-ctrl');

const router = express.Router();

router.post('/quote', QuoteCtrl.createQuote);
// router.put('/quote/:id', QuoteCtrl.updateQuote);
router.delete('/quote/:id', QuoteCtrl.deleteQuote);
router.get('/quote/:id', QuoteCtrl.getQuoteById);
router.get('/quotes', QuoteCtrl.getQuotes);

module.exports = router;