const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Operator = new Schema(
    {
        user: { type: String, required: true },
        password: { type: String, required: true },
    },
    { collection: 'operator' }
)

module.exports = mongoose.model('operator', Operator)