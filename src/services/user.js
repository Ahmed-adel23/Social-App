import api from "./api";

export const fetchUserData = () => {
  return api
    .get("/users/profile-data")
    .then((response) => response.data);
};
