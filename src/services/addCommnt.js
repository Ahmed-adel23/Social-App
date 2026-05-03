import api from "./api";

export const addComment = (postId, formData) => {
  return api.post(`/posts/${postId}/comments`, formData);
};
