import api from "./api";

export const fetchComments = (postId, page = 1, limit = 25) => {
  return api.get(`/posts/${postId}/comments`, {
    params: { page, limit },
  });
};
