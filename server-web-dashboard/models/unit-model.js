const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Unit = new Schema(
    {
        unit_id: { type: Number, required: true },
        pin: { type: String, required: true },
        alamat: { type: String, required: true },
        kota: { type: String, required: true },
        provinsi: { type: String, required: true },
        user_id: { type: String, required: true },
        status_code: { type: Number, required: true },
        last_modified: { type: Date, required: true },
        last_modified_by: { type: Number, required: true },
        is_new_key: { type: Boolean, required: true },
        is_responding: { type: Boolean, required: true },
        last_known_key: { type: String, required: true },
        email: { type: String, required: true },
    },
    { collection: 'unit_test' }
)

module.exports = mongoose.model('unit', Unit)