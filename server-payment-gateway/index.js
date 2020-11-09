const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const jwtSecret = "secret123";

const db = require("./db");

const app = express();
const apiPort = process.env.PORT || 3000;
const apiIpAddress = process.env.IP_ADDRESS || "127.0.0.1";

const MidtransCtrl = require("./payment/midtrans");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (app.get("env") === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/jwt", (req, res) => {
  res.json({
    token: jsonwebtoken.sign({ user: "test" }, jwtSecret),
  });
});

app.get("/pay-test", MidtransCtrl.paymentTokenTest);
app.post("/pay", MidtransCtrl.paymentToken);
app.post("/notification", MidtransCtrl.paymentNotification);

// app.use(jwt({ secret: jwtSecret, algorithms: ['HS256'] }))
app.listen(apiPort, () =>
  console.log(`Server running ${apiIpAddress}:${apiPort}`)
);
