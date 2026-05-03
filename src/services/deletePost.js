import api from "./api";

export const deletePost = (postId) => {
  return api.delete(`/posts/${postId}`);
};
