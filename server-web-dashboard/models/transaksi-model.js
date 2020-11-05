const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Transaksi = new Schema(
    {
        unit_id: { type: String, required: true },
        tanggal_transaksi: { type: Date, required: true },
        jumlah_transaksi: { type: String, required: true },
    },
    { collection: 'transaksi' }
)

module.exports = mongoose.model('transaksi', Transaksi)