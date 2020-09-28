const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UnitRegis = new Schema(
    {
        reg_id: { type: Number, required: true },
        user_id: { type: String, required: true },
        email: { type: String, required: true },
        alamat: { type: String, required: true },
        kota: { type: String, required: true },
        provinsi: { type: String, required: true },
    },
    { collection: 'unit_registration' }
)

module.exports = mongoose.model('unit_registration', UnitRegis)