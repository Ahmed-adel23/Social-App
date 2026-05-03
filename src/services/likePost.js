import api from "./api";

export const likePost = (postId) => {
  return api.put(`/posts/${postId}/like`, {});
};
