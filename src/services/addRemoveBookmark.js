import api from "./api";

export const toggleBookmark = (postId) => {
  return api.put(`/posts/${postId}/bookmark`, {});
};
