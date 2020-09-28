const express = require('express')

const UserCtrl = require('../controllers/unit-ctrl')
const DataListrikCtrl = require('../controllers/datalistrik-ctrl')
const TransaksiCtrl = require('../controllers/transaksi-ctrl')
const TransactionHistoriesCtrl = require('../controllers/transaction-histories-ctrl')
const ServerMeteranCtrl = require('../controllers/server-meteran-ctrl')
const OperatorCtrl = require('../controllers/operator-ctrl')
const UnitRegis = require('../controllers/unit-registration-ctrl')
const NotificationCtrl = require('../controllers/notification-ctrl')

const router = express.Router()

router.post('/create-unit', UserCtrl.createUnit)
router.get('/get-unit/:id', UserCtrl.getUnitById)
router.get('/get-unit', UserCtrl.getUnits)
router.put('/update-status/:id', UserCtrl.updateStatus)
router.get('/get-unit-count', UserCtrl.getJumlahUnitBagian)
router.get('/get-unit-location', UserCtrl.getUnitLocation)

router.get('/get-datalistrik/:id', DataListrikCtrl.getDataListrikAkhir)
router.get('/get-datalistriktotal/:id', DataListrikCtrl.getDataListrikTotal)
router.get('/get-datalistrik-all/current-year/:id', DataListrikCtrl.getCurrentYearDataListrikById)
router.get('/get-datalistrik-all/current-year', DataListrikCtrl.getCurrentYearDataListrik)
router.get('/get-datalistrik-all/last-year', DataListrikCtrl.getLastYearDataListrik)

router.get('/get-transaksi', TransaksiCtrl.getTransaksiAll)
router.get('/get-transaksi/:id', TransaksiCtrl.getTransaksiUnit)
router.get('/get-transaction-histories', TransactionHistoriesCtrl.getTransactionHistories)

router.get('/check-operator/:user/:password', OperatorCtrl.checkOperator);

router.post('/relay', ServerMeteranCtrl.relayFunction);

router.delete('/unit-regis/delete/:id', UnitRegis.deleteRegistration)
router.get('/get-regis', UnitRegis.getRegistration)

router.get('/get-notification/:id', NotificationCtrl.getNotification)

module.exports = router