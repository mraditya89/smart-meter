const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TransactionHistories = new Schema(
    {

    },
    { collection: 'transaction_histories' }
)

module.exports = mongoose.model('transaction_histories', TransactionHistories)