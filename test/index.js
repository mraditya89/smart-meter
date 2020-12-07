const axios = require("axios");

const baseUrl = "http://127.0.0.1:5301";
const url = {
  token: `${baseUrl}/get-operator/admin/bandung123abc`,
  dataListrik: `${baseUrl}/api/datalistrik`,
};

const UNITS = [
  {
    unit_id: 0,
    daya_sisa: 10000,
    daya_pemakaian: 0,
  },
  {
    unit_id: 1,
    daya_sisa: 20000,
    daya_pemakaian: 0,
  },
];

const getToken = (path) => {
  return new Promise((resolve, reject) => {
    axios
      .get(path)
      .then((res) => {
        axios.defaults.headers.common = {
          Authorization: `bearer ${res.data.token}`,
        };
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

const postRequest = (path, body) => {
  return new Promise((resolve, reject) => {
    axios
      .post(path, body)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => reject(err));
  });
};

const sendPostData = async (body) => {
  await postRequest(url.dataListrik, body);
};

const main = () => {
  getToken(url.token)
    .then(() => {
      let job = setInterval(() => {
        UNITS.forEach((unit) => {
          if (unit["daya_sisa"] < 0) {
            clearInterval(job);
            return;
          }
          sendPostData(unit);

          unit["daya_pemakaian"] = Math.random() / 100;
          unit["daya_sisa"] = unit["daya_sisa"] - unit["daya_pemakaian"];
        });
      }, 5 * 1000);
    })
    .catch((err) => console.log(err));
};

main();
