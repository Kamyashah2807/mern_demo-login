import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://agile-chamber-95113.herokuapp.com/api/test";

const getPublicContent = () => {
  return axios.get("https://agile-chamber-95113.herokuapp.com/api/test/all");
};

const getUserBoard = () => {
  return axios.get("https://agile-chamber-95113.herokuapp.com/api/test/user", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get("https://agile-chamber-95113.herokuapp.com/api/test/admin", { headers: authHeader() });
};

export default {
  getPublicContent,
  getUserBoard,
  getAdminBoard,
};