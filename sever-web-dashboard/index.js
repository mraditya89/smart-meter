const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')

const db = require('./db')
const router = require('./routes/router')

const app = express()
const apiPort = process.env.PORT || 3000
const jwtSecret = 'secret123'
const OperatorCtrl = require('./controllers/operator-ctrl')

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

app.get('/get-operator/:user/:password', OperatorCtrl.getOperator);

app.use(jwt({ secret: jwtSecret, algorithms: ['HS256'] }))

app.use('/api', router)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))