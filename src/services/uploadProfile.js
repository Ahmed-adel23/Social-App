import api from "./api";

export const uploadProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append("photo", file);

  return api.put("/users/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
