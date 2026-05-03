import api from "./api";

export const fetchPosts = (page = 1, config = {}) => {
  return api.get("/posts", { params: { page, limit: 20 }, ...config });
};
