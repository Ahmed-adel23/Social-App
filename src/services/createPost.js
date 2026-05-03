import api from "./api";

export const AddPost = (postData) => {
  return api.post("/posts", postData);
};
