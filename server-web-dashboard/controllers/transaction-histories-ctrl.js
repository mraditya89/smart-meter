const TransactionHistories = require('../models/transaction-histories-model')

getTransactionHistories = async (req, res) => {
    await TransactionHistories.find({}, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!data.length) {
            return res
                .status(404)
                .json({ success: false, error: `Transactions not found` })
        }
        return res.status(200).json({ success: true, data: data })
    }).catch(err => console.log(err))
}

module.exports = {
    getTransactionHistories,
}