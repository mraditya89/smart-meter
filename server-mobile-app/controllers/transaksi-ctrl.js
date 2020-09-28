const Transaksi = require('../models/transaksi-model')

getTransaksiAll = async (req, res) => {
    await Transaksi.find({}, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!user.length) {
            return res
                .status(404)
                .json({ success: false, error: `Transaction not found` })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getTransaksiUnit = async (req, res) => {
    await Transaksi.find({ unit_id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!data.length) {
            return res
                .status(404)
                .json({ success: false, error: `Transaction not found` })
        }
        return res.status(200).json({ success: true, data: data })
    }).catch(err => console.log(err))
}

module.exports = {
    getTransaksiAll,
    getTransaksiUnit
}