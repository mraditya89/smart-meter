const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Notification = new Schema(
    {
        unit_id: { type: Number, required: true },
        title: { type: String, required: true },
        body: { type: String, required: true },
        date: { type: Date, required: true },
        is_viewed: { type: Boolean, required: true },
    },
    { collection: 'notification' }
)

module.exports = mongoose.model('notification', Notification)