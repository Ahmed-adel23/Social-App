import api from "./api";

export const getPostDetails = (id) => {
  return api.get(`/posts/${id}`);
};
