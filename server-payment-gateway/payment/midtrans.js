const midtransClient = require('midtrans-client');
const fetch = require('node-fetch');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const thingSchema = new Schema({}, { strict: false });
const Thing = mongoose.model('transaction_historie', thingSchema);

const jsonwebtoken = require('jsonwebtoken')
const jwtSecret = 'secret123'

paymentTokenTest = async (req, res) => {
    let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: 'SB-Mid-server-4RvNNmvsahNVAqFD5OFVmoK9'
    });

    let parameter = {
        "transaction_details": {
            "order_id": "meteran-1-100-" + Date.now(),
            "gross_amount": 10000
        },
        "credit_card": {
            "secure": true
        },
        "customer_details": {
            "first_name": "budi",
            "last_name": "pratama",
            "email": "budi.pra@example.com",
            "phone": "08111222333"
        }
    };

    snap.createTransaction(parameter)
        .then((transaction) => {
            return res.json(transaction)
        }).catch(err => console.log(err))
}

paymentToken = async (req, res) => {
    const body = req.body

    let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: 'SB-Mid-server-4RvNNmvsahNVAqFD5OFVmoK9'
    });

    console.log(body);

    let parameter = {
        "transaction_details": {
            "order_id": body.order_id,
            "gross_amount": body.price
        },
        "credit_card": {
            "secure": true
        },
        "item_details": [
            {
                "id": body.item_id,
                "price": body.price,
                "quantity": 1,
                "name": body.item_name
            },
        ],
        "customer_details": {
            "first_name": body.first_name,
            "last_name": body.last_name,
            "email": body.email,
            "phone": body.phone
        }
    };

    snap.createTransaction(parameter)
        .then((transaction) => {
            return res.json(transaction)
        }).catch((err) => {
            console.log(err)
            return res.status(400).json({
                message: 'Pastikan email dan no telepon benar',
            })
        })
}

paymentNotification = async (req, res) => {
    const body = req.body
    const token = jsonwebtoken.sign({ user: 'server' }, jwtSecret)

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'Body not detected',
        })
    }

    if (body.transaction_status != "settlement" || body.fraud_status != "accept") {
        return res.status(200).json({
            success: false,
            error: 'Transaction not settled or fraud status not accepted',
        })
    }

    let thing = new Thing(body);
    thing
        .save()
        // .then(() => {
        //     return res.status(201).json({
        //         success: true,
        //         message: 'Transaksi status created!',
        //     })
        // })
        // .catch(error => {
        //     return res.status(400).json({
        //         error,
        //         message: 'Transaksi status not created!',
        //     })
        // })

    // Init headers
    let op_code = 8;
    let id = body.order_id.split("-")[1];
    let top_up = body.order_id.split("-")[2] + "000";
    let notification_code = "2";

    // Hit push notification
    var urlNotif = "https://api-meteran-pelanggan.herokuapp.com/notif-push";
    let fetchWaitNotif = await fetch(urlNotif, {
        method: 'get',
        headers: {
            // 'Content-Type': 'application/json',
            "id": id,
            "notification_code": notification_code
        },
    })
    await fetchWaitNotif.json()

    // Hit server meteran
    var url = "http://18.139.0.195:1880/server_meter_api/v1/";
    let fetchWait = await fetch(url, {
        method: 'post',
        headers: {
            // 'Content-Type': 'application/json',
            "Authorization": "Bearer " + token,
            "op_code": op_code,
            "id": id,
            "top_up": top_up
        },
    })
    await fetchWait.json()
        .then((data) => {
            return res.status(200).json(data)
        })
        .catch(error => {
            console.log(error)
            return res.status(400).json({
                error,
                message: 'Not connected to server meteran',
            })
        })
}

module.exports = {
    paymentTokenTest,
    paymentToken,
    paymentNotification,
}