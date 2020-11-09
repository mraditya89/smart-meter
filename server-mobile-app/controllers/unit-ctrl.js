const Unit = require("../models/unit-model");
const jsonwebtoken = require("jsonwebtoken");
const jwtSecret = "secret123";
const bcrypt = require("bcryptjs");
const saltRounds = 10;

loginUser = async (req, res) => {
  await Unit.findOne({ unit_id: req.params.id }, (err, data) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!data) {
      return res.status(404).json({ success: false, error: `User not found` });
    } else {
      bcrypt.compare(req.params.pin, data.pin, function (err, result) {
        if (result == true) {
          return res.json({
            token: jsonwebtoken.sign({ user: data.unit_id }, jwtSecret),
          });
        } else {
          return res
            .status(404)
            .json({ success: false, error: `Pin incorrect ` });
        }
      });
      // if (data.pin == req.params.pin) {
      //     return res
      //         .json({
      //             token: jsonwebtoken.sign({ user: data.unit_id }, jwtSecret)
      //         })
      // } else {
      //     return res
      //         .status(404)
      //         .json({ success: false, error: `Pin incorrect ` })
      // }
    }
  }).catch((err) => console.log(err));
};

changePin = async (req, res) => {
  await Unit.findOne({ unit_id: req.params.id }, (err, data) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!data) {
      return res.status(404).json({ success: false, error: `User not found` });
    } else {
      bcrypt.compare(req.params.pin, data.pin, function (err, result) {
        if (result == true) {
          bcrypt.hash(req.params.newpin, saltRounds, function (err, hash) {
            if (err) {
              return res.status(404).json({ data: err });
            } else {
              data.pin = hash;
              data
                .save()
                .then(() => {
                  return res.json({ data: "password changed" });
                })
                .catch((e) => {
                  return res.status(404).json({ data: e });
                });
            }
          });
        } else {
          return res
            .status(404)
            .json({ success: false, error: `Pin incorrect ` });
        }
      });
    }
  }).catch((err) => console.log(err));
};

getUnitById = async (req, res) => {
  await Unit.findOne({ unit_id: req.params.id }, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: `User not found` });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => console.log(err));
};

getUnits = async (req, res) => {
  await Unit.find({}, (err, user) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    // console.log(user);
    if (!user.length) {
      return res.status(404).json({ success: false, error: `Users not found` });
    }
    return res.status(200).json({ success: true, data: user });
  }).catch((err) => console.log(err));
};

updateStatus = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  Unit.findOne({ unit_id: req.params.id }, (err, status) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Unit not found!",
      });
    }
    status.status_code = body.status_code;
    status.last_modified = new Date();
    status
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: status._id,
          message: "Status updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Status not updated!",
        });
      });
  });
};

module.exports = {
  loginUser,
  getUnitById,
  getUnits,
  updateStatus,
  changePin,
};
