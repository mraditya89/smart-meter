const fetch = require("node-fetch");

relayFunction = async (req, res) => {
  let rcode = 1;
  if (req.headers.ison == 0) {
    // matikan
    rcode = 3;
  } else {
    // nyalakan
    rcode = 1;
  }

  var url = process.env.SERVER_METERAN_URI;
  let fetchWait = await fetch(url, {
    method: "post",
    headers: {
      // 'Content-Type': 'application/json',
      Authorization: req.headers.Authorization,
      op_code: req.headers.op_code,
      id: req.headers.id,
      ison: req.headers.ison,
      rcode: rcode,
    },
  });
  await fetchWait
    .json()
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({
        error,
        message: "Not connected to server meteran",
      });
    });
};

module.exports = {
  relayFunction,
};
