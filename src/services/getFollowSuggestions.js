import api from "./api";

export const getFollowSuggestions = () => {
  return api.get("/users/suggestions", { params: { limit: 10 } });
};
