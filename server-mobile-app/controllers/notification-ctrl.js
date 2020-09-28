const admin = require("firebase-admin");
const Notification = require('../models/notification-model');

postNotification = async (req, res) => {
    let isPushNotification = true;
    var topic = 'off';
    var title = '';
    var body = '';
    if(req.headers.id) {
        topic = req.headers.id;
    } else {
        return res.json({message: "Headers id not defined"});
    }

    if(req.headers.notification_code == 0) {
        title = 'Pulsa Listrik Akan Habis';
        body = 'PERINGATAN : Pulsa listrik pada unit meteran ' + topic + ' akan habis, mohon diisi ulang';

        let dt = new Date();
        let today = dt.getFullYear()+"-"+("0" + (dt.getMonth() + 1)).slice(-2)+"-"+("0" + dt.getDate()).slice(-2);
        let tomorrow = dt.getFullYear()+"-"+("0" + (dt.getMonth() + 1)).slice(-2)+"-"+("0" + (dt.getDate()+1)).slice(-2);

        await Notification.find({unit_id: req.headers.id, title: title, date: {$gte: today, $lte: tomorrow}}, (err, data) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }

            if(data.length > 0) {
                // Notifikasi sudah dilakukan
                isPushNotification = false;
                return res.json({message: data});
            } else {
                let notifBody = {
                    "unit_id" : req.headers.id,
                    "title" : title,
                    "body" : body,
                    "date" : Date.now(),
                    "is_viewed" : false,
                }
                const newNotification = new Notification(notifBody);
                newNotification.save().then(()=>{
                    console.log("notification created on db");
                }).catch(err=>{
                    console.log(err);
                })
            }
        }).catch(err => console.log(err))
    } else if(req.headers.notification_code == 1) {
        title = 'Beban Listrik Berlebih';
        body = 'PERINGATAN : Beban listrik pada unit meteran ' + topic + ' berlebih, mohon di cek';
        let notifBody = {
            "unit_id" : req.headers.id,
            "title" : title,
            "body" : body,
            "date" : Date.now(),
            "is_viewed" : false,
        }
        const newNotification = new Notification(notifBody);
        newNotification.save().then(()=>{
            console.log("notification created on db");
        }).catch(err=>{
            console.log(err);
        })
    } else if(req.headers.notification_code == 2) {
        title = 'Pembayaran Pengisian Pulsa Berhasil';
        body = 'Pembayaran untuk penambahan pulsa listrik unit meteran ' + topic + ' berhasil, pulsa akan ditambahkan';
        let notifBody = {
            "unit_id" : req.headers.id,
            "title" : title,
            "body" : body,
            "date" : Date.now(),
            "is_viewed" : false,
        }
        const newNotification = new Notification(notifBody);
        newNotification.save().then(()=>{
            console.log("notification created on db");
        }).catch(err=>{
            console.log(err);
        })
    } else if(req.headers.notification_code == 3) {
        title = 'Unit Meteran Dimatikan';
        body = 'Unit meteran dimatikan oleh pelanggan';
        let notifBody = {
            "unit_id" : req.headers.id,
            "title" : title,
            "body" : body,
            "date" : Date.now(),
            "is_viewed" : false,
        }
        const newNotification = new Notification(notifBody);
        newNotification.save().then(()=>{
            console.log("notification created on db");
        }).catch(err=>{
            console.log(err);
        })
    } else if(req.headers.notification_code == 4) {
        title = 'Unit Meteran Dimatikan';
        body = 'Unit meteran dimatikan oleh pengelola';
        let notifBody = {
            "unit_id" : req.headers.id,
            "title" : title,
            "body" : body,
            "date" : Date.now(),
            "is_viewed" : false,
        }
        const newNotification = new Notification(notifBody);
        newNotification.save().then(()=>{
            console.log("notification created on db");
        }).catch(err=>{
            console.log(err);
        })
    } else if(req.headers.notification_code == 5) {
        title = 'Unit Meteran Dimatikan';
        body = 'Unit meteran dimatikan karena saldo listrik habis';
        let notifBody = {
            "unit_id" : req.headers.id,
            "title" : title,
            "body" : body,
            "date" : Date.now(),
            "is_viewed" : false,
        }
        const newNotification = new Notification(notifBody);
        newNotification.save().then(()=>{
            console.log("notification created on db");
        }).catch(err=>{
            console.log(err);
        })
    } else if(req.headers.notification_code == 6) {
        title = 'Unit Meteran Dimatikan';
        body = 'Unit meteran dimatikan karena beban listrik berlebih';
        let notifBody = {
            "unit_id" : req.headers.id,
            "title" : title,
            "body" : body,
            "date" : Date.now(),
            "is_viewed" : false,
        }
        const newNotification = new Notification(notifBody);
        newNotification.save().then(()=>{
            console.log("notification created on db");
        }).catch(err=>{
            console.log(err);
        })
    } else if(req.headers.notification_code == 7) {
        title = 'Unit Meteran Dinyalakan';
        body = 'Unit meteran dinyalakan oleh pelanggan';
        let notifBody = {
            "unit_id" : req.headers.id,
            "title" : title,
            "body" : body,
            "date" : Date.now(),
            "is_viewed" : false,
        }
        const newNotification = new Notification(notifBody);
        newNotification.save().then(()=>{
            console.log("notification created on db");
        }).catch(err=>{
            console.log(err);
        })
    } else if(req.headers.notification_code == 8) {
        title = 'Unit Meteran Dinyalakan';
        body = 'Unit meteran dinyalakan oleh pengelola';
        let notifBody = {
            "unit_id" : req.headers.id,
            "title" : title,
            "body" : body,
            "date" : Date.now(),
            "is_viewed" : false,
        }
        const newNotification = new Notification(notifBody);
        newNotification.save().then(()=>{
            console.log("notification created on db");
        }).catch(err=>{
            console.log(err);
        })
    } else if(req.headers.notification_code == 9) {
        title = 'PERHATIAN : Meteran Terbuka';
        body = 'Unit meteran anda telah terbuka mohon hubungi petugas terdekat';
        let notifBody = {
            "unit_id" : req.headers.id,
            "title" : title,
            "body" : body,
            "date" : Date.now(),
            "is_viewed" : false,
        }
        const newNotification = new Notification(notifBody);
        newNotification.save().then(()=>{
            console.log("notification created on db");
        }).catch(err=>{
            console.log(err);
        })
    } else if(req.headers.notification_code == 10) {
        title = 'Over Voltage / Under Voltage';
        body = 'PERINGATAN : Unit meteran anda mungkin over / under voltage';
        let notifBody = {
            "unit_id" : req.headers.id,
            "title" : title,
            "body" : body,
            "date" : Date.now(),
            "is_viewed" : false,
        }
        const newNotification = new Notification(notifBody);
        newNotification.save().then(()=>{
            console.log("notification created on db");
        }).catch(err=>{
            console.log(err);
        })
    } else {
        return res.json({message: "Headers notification_code not defined correctly"});
    }

    // See documentation on defining a message payload.
    var message = {
        notification: {
            title: title,
            body: body
        },
        topic : topic
    };
    // Send a message to devices subscribed to the combination of topics
    // specified by the provided condition.
    if(isPushNotification == true) {
        admin.messaging().send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
                return res.json({message: response});
            })
            .catch((error) => {
                console.log('Error sending message:', error);
                return res.json({message: response});
            });
    }
}

getNotification = async (req, res) => {
    await Notification.find({unit_id: req.params.id, is_viewed: false}, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!data.length) {
            return res
                .status(404)
                .json({ success: false, error: `Notification not found` })
        }
        return res.status(200).json({ success: true, data: data })
    }).sort({_id : -1}).catch(err => console.log(err))
}

notificationIsViewed = async (req, res) => {
    await Notification.find({unit_id: req.params.id, is_viewed: false}, (err, data) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!data.length) {
            return res
                .status(404)
                .json({ success: false, error: `Notification not found` })
        }
        data.forEach(notif=>{
            notif.is_viewed = true;
            notif.save();
        })
        return res.status(200).json({ success: true, message: "Notification viewed" })
    }).sort({_id : -1}).catch(err => console.log(err))
}

module.exports = {
    postNotification,
    getNotification,
    notificationIsViewed,
}

