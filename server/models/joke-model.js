const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Joke = new Schema(
    {
        date: { type: Number, required: true },
        id: { type: String, required: true },
        filename: { type: String, required: true },
        description: { type: String, required: false },
        idPerson: { type: String, required: true },
        type: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('jokes', Joke)