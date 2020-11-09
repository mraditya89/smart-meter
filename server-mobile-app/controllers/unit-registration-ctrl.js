const UnitRegis = require("../models/unit-registration-model");

postRegistration = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: "Body not detected",
    });
  }

  const bd = {
    reg_id: Date.now(),
    user_id: body.user_id,
    email: body.email,
    alamat: body.alamat,
    kota: body.kota,
    provinsi: body.provinsi,
  };

  const unit = new UnitRegis(bd);
  unit
    .save()
    .then(() => {
      return res.json({ data: "Unit created" });
    })
    .catch((e) => {
      return res.status(404).json({ data: "Unit not created" });
    });
};

module.exports = {
  postRegistration,
};
