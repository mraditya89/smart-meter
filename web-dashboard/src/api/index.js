import axios from "axios";

// const apiUrl = 'https://api-meteran-dashboard.herokuapp.com/api'
const apiUrl = `${process.env.REACT_APP_WEB_SERVER}/api`;

const token = localStorage.getItem("token");
const api = axios.create({
  baseURL: apiUrl,
  // headers: { 'Authorization': 'Bearer ' + token }
});

export const getJumlahUnitBagian = () =>
  api.get(`/get-unit-count`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
export const getUnitLocation = () =>
  api.get(`/get-unit-location`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
export const getUnits = () =>
  api.get(`/get-unit`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
export const getUnitById = (id) =>
  api.get(`/get-unit/${id}`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });

export const getCurrentYearById = (id) =>
  api.get(`/get-datalistrik-all/current-year/${id}`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
export const getCurrentYear = () =>
  api.get(`/get-datalistrik-all/current-year`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
export const getLastYear = () =>
  api.get(`/get-datalistrik-all/last-year`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
export const getDataListrikAkhir = (id) =>
  api.get(`/get-datalistrik/${id}`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
export const getDataListrikTotal = (id) =>
  api.get(`/get-datalistriktotal/${id}`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });

export const getTransactionHistories = () =>
  api.get(`/get-transaction-histories`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });

export const createUnit = (data) =>
  api.post(`/create-unit`, data, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
export const deleteRegis = (id) =>
  api.delete(`/unit-regis/delete/${id}`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });
export const getRegis = () =>
  api.get(`/get-regis`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });

export const getNotif = (id) =>
  api.get(`/get-notification/${id}`, {
    headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  });

// export const getOperator = (user,password) => api.get(`/get-operator/${user}/${password}`)

const apis = {
  getUnits,
  getUnitById,
  getDataListrikAkhir,
  getDataListrikTotal,
  getTransactionHistories,
  getCurrentYear,
  getLastYear,
  getUnitLocation,
  getCurrentYearById,
  getRegis,
  deleteRegis,
  createUnit,
  getNotif,
  getJumlahUnitBagian,
};

export default apis;
