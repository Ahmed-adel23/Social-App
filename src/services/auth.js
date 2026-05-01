import axios from "axios";

const API_URL = "https://route-posts.routemisr.com/users";

// register api
export const registerUser = (data) => {
  return axios
    .post(`${API_URL}/signup`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data?.message || "Server error";
    });
};

// logon api
export const loginUser = (data) => {
  return axios
    .post(`${API_URL}/signin`, data)
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data?.message || "Server error";
    });
};
