import api from "./api";

export const getBookmarks = () => {
  return api.get("/users/bookmarks");
};
