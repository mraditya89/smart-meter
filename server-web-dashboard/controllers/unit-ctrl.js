const Unit = require("../models/unit-model");
const UnitRegis = require("../models/unit-registration-model");
const DataListrik = require("../models/datalistrik-model");

createUnit = async (req, res) => {
  const body = req.body;
  // console.log(body);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a user",
    });
  }
  // console.log(1);
  await UnitRegis.findOne({ reg_id: body.reg_id }, (err, data) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (data) data.remove().catch((err) => console.log(err));
  }).catch((err) => console.log(err));

  let unit_id = 0;
  await Unit.findOne({}, (err, unit) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (unit) unit_id = unit.unit_id + 1;
  })
    .sort({ unit_id: -1 })
    .catch((err) => console.log(err));

  const bd = {
    unit_id: unit_id,
    pin: process.env.UNIT_PIN,
    alamat: body.alamat,
    kota: body.kota,
    provinsi: body.provinsi,
    user_id: body.user_id,
    status_code: 0,
    last_modified: Date.now(),
    last_modified_by: 0,
    is_new_key: false,
    is_responding: false,
    last_known_key: process.env.LAST_KNOWN_KEY,
    email: body.email,
  };

  const newUnit = new Unit(bd);
  if (!newUnit) {
    return res.status(400).json({ success: false, error: err });
  }
  newUnit
    .save()
    .then(() => {
      data_listrik_test = new DataListrik({
        unit_id: unit_id,
        daya_sisa: 0,
        daya_pemakaian: 0,
        date_time: Date.now(),
      });
      data_listrik_test.save().then(() => {
        return res.status(201).json({
          success: true,
          message: "Unit created!",
        });
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Unit not created!",
      });
    });
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
    if (!user.length) {
      return res.status(404).json({ success: false, error: `Users not found` });
    }
    return res.status(200).json({ success: true, data: user });
  })
    .sort({ unit_id: 1 })
    .catch((err) => console.log(err));
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

getJumlahUnitBagian = async (req, res) => {
  await Unit.find({}, (err, units) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    let jumlahTotal = units.length;
    let jumlahOn = 0;
    let jumlahOff = 0;
    let jumlahTempered = 0;
    units.forEach((unit) => {
      if (unit.status_code == 0) {
        jumlahOff++;
      } else if (unit.status_code == 1) {
        jumlahOn++;
      } else {
        jumlahTempered++;
      }
    });
    let data = {
      total: jumlahTotal,
      on: jumlahOn,
      off: jumlahOff,
      tempered: jumlahTempered,
    };
    return res.status(200).json({ success: true, data: data });
  }).catch((err) => console.log(err));
};

getUnitLocation = async (req, res) => {
  await Unit.find({}, (err, unit) => {
    let label = [];
    let count = [];

    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    for (let i = 0; i < unit.length; i++) {
      if (label.length <= 0) {
        label.push(unit[i].kota);
        count.push(1);
      } else {
        let islabeled = false;
        label.forEach((label, index) => {
          if (label == unit[i].kota) {
            count[index] += 1;
            islabeled = true;
          }
        });
        if (islabeled == false) {
          label.push(unit[i].kota);
          count.push(1);
        }
      }
    }

    return res
      .status(200)
      .json({ success: true, data: { label: label, count: count } });
  }).catch((err) => console.log(err));
};

module.exports = {
  createUnit,
  getUnitById,
  getUnits,
  updateStatus,
  getUnitLocation,
  getJumlahUnitBagian,
};
