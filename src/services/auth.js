import api from "./api";

export const registerUser = (data) => {
  return api
    .post("/users/signup", data)
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data?.message || "Server error";
    });
};

export const loginUser = (data) => {
  return api
    .post("/users/signin", data)
    .then((response) => response.data)
    .catch((error) => {
      throw error.response?.data?.message || "Server error";
    });
};
