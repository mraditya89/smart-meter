const express = require('express')

const UserCtrl = require('../controllers/unit-ctrl')
const DataListrikCtrl = require('../controllers/datalistrik-ctrl')
const TransaksiCtrl = require('../controllers/transaksi-ctrl')
const NotificationCtrl = require('../controllers/notification-ctrl')

const router = express.Router()

router.get('/get-unit/:id', UserCtrl.getUnitById)
router.get('/get-unit', UserCtrl.getUnits)
router.get('/pin-change/:id/:pin/:newpin', UserCtrl.changePin)
router.put('/update-status/:id', UserCtrl.updateStatus)

router.get('/get-datalistrik/:id', DataListrikCtrl.getDataListrikAkhir)
router.get('/get-datalistriktotal/:id', DataListrikCtrl.getDataListrikTotal)
router.get('/get-datalistrik-tahunan/:id', DataListrikCtrl.getCurrentYearDataListrikById)

router.get('/get-transaksi', TransaksiCtrl.getTransaksiAll)
router.get('/get-transaksi/:id', TransaksiCtrl.getTransaksiUnit)

router.get('/notif-get/:id', NotificationCtrl.getNotification)
router.get('/notif-viewed/:id', NotificationCtrl.notificationIsViewed)

module.exports = router