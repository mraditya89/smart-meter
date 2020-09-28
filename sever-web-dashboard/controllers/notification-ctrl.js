const Notification = require('../models/notification-model');

getNotification = async (req, res) => {
    await Notification.find({unit_id: req.params.id}, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // if (!data.length) {
        //     return res
        //         .status(404)
        //         .json({ success: false, error: `Notification not found` })
        // }
        return res.status(200).json({ success: true, data: data })
    }).sort({_id : -1}).catch(err => console.log(err))
}

module.exports = {
    getNotification,
}

