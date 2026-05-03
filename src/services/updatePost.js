import api from "./api";

export const updatePost = (postId, formData) => {
  return api.put(`/posts/${postId}`, formData);
};
