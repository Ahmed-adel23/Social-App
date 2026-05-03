import api from "./api";

export function changePassword(data) {
  return api
    .patch("/users/change-password", {
      password: data.password,
      newPassword: data.newPassword,
    })
    .then((response) => response.data);
}
