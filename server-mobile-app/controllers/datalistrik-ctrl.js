const DataListrik = require("../models/datalistrik-model");

getDataListrikAkhir = async (req, res) => {
  await DataListrik.find({ unit_id: req.params.id }, (err, data) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    // if (!data) {
    //     return res
    //         .status(404)
    //         .json({ success: false, error: `User not found` })
    // }

    let lastData = data[0];
    // let lastDateRange = data[0].date_time.getTime() - 250000;
    // data.forEach(data=>{
    //     if(data.date_time.getTime() >= lastDateRange) {
    //         lastData = data;
    //     }
    // })

    return res.status(200).json({ success: true, data: lastData });
  })
    .sort({ date_time: -1 })
    .limit(10)
    .catch((err) => console.log(err));
};

getDataListrikTotal = async (req, res) => {
  await DataListrik.find({ unit_id: req.params.id }, (err, data) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    // if (!data.length) {
    //     return res
    //         .status(404)
    //         .json({ success: false, error: `Users not found` })
    // }
    return res.status(200).json({ success: true, data: data });
  }).catch((err) => console.log(err));
};

getCurrentYearDataListrikById = async (req, res) => {
  let dt = new Date();
  let currentYear = dt.getFullYear().toString();
  let nextYear = (dt.getFullYear() + 1).toString();
  let dataDaya = [];
  await DataListrik.find(
    {
      unit_id: req.params.id,
      date_time: { $gte: currentYear, $lte: nextYear },
    },
    (err, data) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      // if (!data.length) {
      //     return res
      //         .status(404)
      //         .json({ success: false, error: `Data listrik not found` })
      // }

      let dataFilter = [];
      let timeFilter = data[0].date_time.getTime() - 250000;
      let powerToleranceBase = data[0].daya_pemakaian;
      data.forEach((data) => {
        if (data.date_time.getTime() < timeFilter) {
          timeFilter = data.date_time.getTime() - 250000;
          powerToleranceBase = data.daya_pemakaian;
          dataFilter.push(data);
        } else {
          if (dataFilter.length > 0) {
            let tolerance = Math.abs(powerToleranceBase - data.daya_pemakaian);
            if (tolerance > powerToleranceBase * 0.1) {
              dataFilter.push(data);
            }
          } else {
            dataFilter.push(data);
          }
        }
      });

      for (let i = 0; i < 12; i++) {
        dataDaya[i] = 0;
        dataFilter.forEach((data) => {
          if (i == data.date_time.getMonth()) {
            dataDaya[i] += data.daya_pemakaian;
          }
        });
      }
      return res.status(200).json({ success: true, data: dataDaya });
    }
  )
    .sort({ date_time: -1 })
    .catch((err) => console.log(err));
};

module.exports = {
  getDataListrikAkhir,
  getDataListrikTotal,
  getCurrentYearDataListrikById,
};
