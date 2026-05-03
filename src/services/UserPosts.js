import api from "./api";

export const getUserPosts = (userId, limit = 20) => {
  return api
    .get(`/users/${userId}/posts`, { params: { limit } })
    .then((response) => response.data);
};
