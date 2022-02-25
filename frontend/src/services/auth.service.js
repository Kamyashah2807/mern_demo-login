import axios from "axios";

const API_URL = "https://agile-chamber-95113.herokuapp.com/api/auth";

const register = (username, email, password) => {
  return axios.post("https://agile-chamber-95113.herokuapp.com/api/auth/signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios
    .post("https://agile-chamber-95113.herokuapp.com/api/auth/signin", {
      username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};