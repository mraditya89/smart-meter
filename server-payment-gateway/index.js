const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')
const jwtSecret = 'secret123'

const db = require('./db')

const app = express()
const apiPort = process.env.PORT || 3000

const MidtransCtrl = require('./payment/midtrans')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/jwt', (req, res) => {
  res.json({
    token: jsonwebtoken.sign({ user: 'test' }, jwtSecret)
  })
})

app.get('/pay-test', MidtransCtrl.paymentTokenTest);
app.post('/pay', MidtransCtrl.paymentToken);
app.post('/notification', MidtransCtrl.paymentNotification);

// app.use(jwt({ secret: jwtSecret, algorithms: ['HS256'] }))

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))