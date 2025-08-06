import axiosClient from ".";

export function getTagsList(params: { page: number; itemsPerPage: number; sortBy?: string; sortDesc?: any }) {
  return axiosClient.get("tags", {
    params,
  });
}

export function createTags(data: any) {
  return axiosClient.post(`tags`, data);
}

export function getTagsById(id: any) {
  return axiosClient.get(`tags/${id}`);
}

export function updateTags(id: any, data: any) {
  return axiosClient.put(`tags/${id}`, data);
}

export function deleteTags(id: any) {
  return axiosClient.delete(`tags/${id}`);
}
