import api from "./api";

export const fetchNotifications = () => {
  return api.get("/notifications", {
    params: { unread: false, page: 1, limit: 10 },
  });
};

export const fetchRecentNotifications = () => {
  return api.get("/notifications", {
    params: { unread: false, page: 1, limit: 5 },
  });
};
