import api from "./api";

export const toggleFollow = (userId) => {
  return api.put(`/users/${userId}/follow`, {});
};
