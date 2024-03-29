const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Quote = new Schema(
    {
        date: { type: Number, required: true },
        id: { type: String, required: true },
        quote: { type: String, required: true },
        author: { type: String, required: false },
        idPerson: { type: String, required: true },
        comments: [
            { 
                id: { type: String, required: true },
                body: {type: String, required: true}, 
                date: {type: Number, required: true}, 
                idPerson: {type: String, required: true},
            },
        ],
        likes: [
            {type: String, required: true},
        ],
    },
    { timestamps: true },
)

module.exports = mongoose.model('quotes', Quote)