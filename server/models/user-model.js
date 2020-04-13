const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
    {
        date: { type: Number, required: true },
        id: { type: String, required: true },
        name: { type: String, required: true },
        pp: { type: String, required: false },
        password: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('users', User)