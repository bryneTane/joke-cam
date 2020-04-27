const fs = require('fs');

const Quote = require('../models/quote-model');

createQuote = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a quote',
        })
    }
    body.id = Date.now();
    const quote = new Quote(body)

    if (!quote) {
        return res.status(400).json({ success: false, error: err })
    }

    quote
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: quote.id,
                message: 'Quote created!',
            });
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Quote not created!',
            });
        });
}

// updateQuote = async (req, res) => {
//     const body = req.body;

//     if (!body) {
//         return res.status(400).json({
//             success: false,
//             error: 'You must provide a body to update',
//         });
//     }

//     Quote.findOne({ id: req.params.id }, (err, quote) => {
//         if (err) {
//             return res.status(404).json({
//                 err,
//                 message: 'Quote not found!',
//             });
//         }
//         quote.name = body.name;
//         if(body.pp){
//             var imageBuffer = decodeBase64Image(body.pp);
//             // console.log(process.env.PUBLIC_URL)
//             fs.writeFile(`../public/img/${req.params.id}.jpg`, imageBuffer.data, function(err) { 
//                 // console.log(err);
//                 if(!err) quote.pp = req.params.id + '.jpg';
//                 quote
//                     .save()
//                     .then(() => {
//                         return res.status(200).json({
//                             success: true,
//                             id: quote.id,
//                             message: 'Quote updated!',
//                         });
//                     })
//                     .catch(error => {
//                         return res.status(404).json({
//                             error,
//                             message: 'Quote not updated!',
//                         });
//                     });
//             });
//         }
//         else quote
//                 .save()
//                 .then(() => {
//                     return res.status(200).json({
//                         success: true,
//                         id: quote.id,
//                         message: 'Quote updated!',
//                     });
//                 })
//                 .catch(error => {
//                     return res.status(404).json({
//                         error,
//                         message: 'Quote not updated!',
//                     });
//                 });
//     });
// }

commentQuote = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    Quote.findOne({ id: req.params.id }, (err, quote) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Quote not found!',
            });
        }
        quote.comments = body.comments;
        quote
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: quote.id,
                    message: 'Quote updated!',
                });
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Quote not updated!',
                });
            });
    });
}

likeOrDislikeQuote = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        });
    }

    Quote.findOne({ id: req.params.id }, (err, quote) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Quote not found!',
            });
        }
        quote.likes = body.likes;
        quote
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: quote.id,
                    message: 'Quote updated!',
                });
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'Quote not updated!',
                });
            });
    });
}

deleteQuote = async (req, res) => {
    await Quote.findOneAndDelete({ id: req.params.id }, (err, quote) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!quote) {
            return res
                .status(404)
                .json({ success: false, error: `Quote not found` });
        }

        return res.status(200).json({ success: true, data: quote });
    }).catch(err => console.log(err));
}

getQuoteById = async (req, res) => {
    await Quote.findOne({ id: req.params.id }, (err, quote) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }

        if (!quote) {
            return res
                .status(404)
                .json({ success: false, error: `Quote not found` });
        }
        return res.status(200).json({ success: true, data: quote });
    }).catch(err => console.log(err));
}

getQuotes = async (req, res) => {
    await Quote.find({}, (err, quotes) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        if (!quotes.length) {
            return res
                .status(404)
                .json({ success: false, error: `Quote not found` });
        }
        return res.status(200).json({ success: true, data: quotes });
    }).catch(err => console.log(err));
}

module.exports = {
    createQuote,
    // updateQuote,
    deleteQuote,
    getQuotes,
    getQuoteById,
    commentQuote,
    likeOrDislikeQuote,
}