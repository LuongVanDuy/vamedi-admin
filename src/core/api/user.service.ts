import axiosClient from ".";

export function getUserList(params: {
  page: number;
  itemsPerPage: number;
  search?: string;
  status?: any;
  sortBy?: string;
  sortDesc?: any;
}) {
  return axiosClient.get("users", {
    params,
  });
}

export function getUserDetail(id: any) {
  return axiosClient.get(`users/${id}`);
}

export function updateUser(id: any, data: any) {
  return axiosClient.put(`users/${id}`, data);
}

export function createUser(data: any) {
  return axiosClient.post("users", data);
}

export function enableUser(id: any) {
  return axiosClient.patch(`users/${id}/active`);
}

export function disableUser(id: any) {
  return axiosClient.patch(`users/${id}/deactivate`);
}

export function deleteUser(id: any) {
  return axiosClient.delete(`users/${id}`);
}
