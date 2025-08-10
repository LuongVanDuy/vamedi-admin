import axiosClient from "./index";

export function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post("file/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
