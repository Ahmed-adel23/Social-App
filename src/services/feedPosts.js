import api from "./api";

export const fetchFeedPosts = (page = 1, config = {}) => {
  return api.get(`/posts/feed?only=following&limit=10&page=${page}`, config);
};
