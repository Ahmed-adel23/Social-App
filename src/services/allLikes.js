import api from "./api";

export const fetchAllLikes = (postId) => {
  return api.get(`/posts/${postId}/likes`, {
    params: { page: 1, limit: 20 },
  });
};
