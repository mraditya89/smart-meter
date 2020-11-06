const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");

const db = require("./db");
const router = require("./routes/router");

const app = express();
const apiPort = process.env.PORT || 3000;
const apiIpAddress = process.env.IP_ADDRESS || "127.0.0.1";
const jwtSecret = "secret123";
const UnitCtrl = require("./controllers/unit-ctrl");
const NotificationCtrl = require("./controllers/notification-ctrl");
const UnitRegisCtrl = require("./controllers/unit-registration-ctrl");

// Check bcrypt
// const bcrypt = require('bcryptjs');
// const saltRounds = 10;
// app.get('/encrypt/:id', (req, res) => {
//   bcrypt.hash(req.params.id, saltRounds, function (err, hash) {
//     if (err) {
//       return res.json({ data: err })
//     } else {
//       return res.json({ data: hash })
//     }
//   });
// })
// app.get('/compare/:id', (req, res) => {
//   let hashed = '$2b$10$2c/gKPvDEb.wrdUisFZbCeOcdHFCtE1/ZH6gRXsXehfh2lA/.Fb3a';
//   bcrypt.compare(req.params.id, hashed, function (err, result) {
//     if (result == true) {
//       return res.json({ data: 'matched' })
//     } else {
//       return res.json({ data: 'not match' })
//     }
//   });
// })

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

if (app.get("env") === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// Firebase Init
var admin = require("firebase-admin");
var serviceAccount = require("./smartmeter-itb-firebase-adminsdk-s254y-0e9dd6b538.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URI,
});

// Firebase Notification
app.get("/notif-push", NotificationCtrl.postNotification);

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/jwt", (req, res) => {
  res.json({
    token: jsonwebtoken.sign({ user: "test" }, jwtSecret),
  });
});

app.get("/login/:id/:pin", UnitCtrl.loginUser);
app.post("/unit/register", UnitRegisCtrl.postRegistration);

app.use(jwt({ secret: jwtSecret, algorithms: ["HS256"] }));

app.use("/api", router);

app.listen(apiPort, apiIpAddress, () =>
  console.log(`Server running ${apiIpAddress}:${apiPort}`)
);
