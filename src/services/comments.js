import axios from "axios";

export const fetchComments = async (postId, page = 1, limit = 25) => {
  return axios.get(
    `https://route-posts.routemisr.com/posts/${postId}/comments`,
    {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    },
  );
};
