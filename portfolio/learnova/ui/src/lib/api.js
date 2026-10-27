const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/lms";

const defaultHeaders = {};

export const apiRequest = async (path, options = {}) => {
  const { body, headers, admin = false, signal, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    ...rest,
    signal,
    headers: {
      ...defaultHeaders,
      ...(headers || {}),
      ...(admin ? { "x-user-role": "admin" } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    credentials: "include",
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    let errorMessage = "Request failed";

    try {
      const errorBody = await response.clone().json();
      errorMessage = errorBody?.message || JSON.stringify(errorBody);
    } catch (jsonError) {
      const errorText = await response.text();
      if (errorText) {
        errorMessage = errorText;
      }
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const CourseApi = {
  list: (params, options = {}) => {
    const query = new URLSearchParams(params || {}).toString();
    return apiRequest(`/api/courses${query ? `?${query}` : ""}`, options);
  },
  create: (payload) =>
    apiRequest("/api/courses", { method: "POST", body: payload, admin: true }),
  update: (id, payload) =>
    apiRequest(`/api/courses/${id}`, {
      method: "PUT",
      body: payload,
      admin: true,
    }),
  remove: (id) =>
    apiRequest(`/api/courses/${id}`, { method: "DELETE", admin: true }),
  updateStatus: (id, payload) =>
    apiRequest(`/api/courses/${id}/status`, {
      method: "PATCH",
      body: payload,
      admin: true,
    }),
  enroll: (id, payload) =>
    apiRequest(`/api/courses/${id}/enroll`, { method: "POST", body: payload }),
  addChapter: (id, payload) =>
    apiRequest(`/api/courses/${id}/chapters`, {
      method: "POST",
      body: payload,
      admin: true,
    }),
  updateChapter: (id, chapterId, payload) =>
    apiRequest(`/api/courses/${id}/chapters/${chapterId}`, {
      method: "PATCH",
      body: payload,
      admin: true,
    }),
  deleteChapter: (id, chapterId) =>
    apiRequest(`/api/courses/${id}/chapters/${chapterId}`, {
      method: "DELETE",
      admin: true,
    }),
  addSection: (id, chapterId, payload) =>
    apiRequest(`/api/courses/${id}/chapters/${chapterId}/sections`, {
      method: "POST",
      body: payload,
      admin: true,
    }),
  updateSection: (id, chapterId, sectionId, payload) =>
    apiRequest(
      `/api/courses/${id}/chapters/${chapterId}/sections/${sectionId}`,
      {
        method: "PATCH",
        body: payload,
        admin: true,
      }
    ),
  deleteSection: (id, chapterId, sectionId) =>
    apiRequest(
      `/api/courses/${id}/chapters/${chapterId}/sections/${sectionId}`,
      {
        method: "DELETE",
        admin: true,
      }
    ),
};

export const AuthApi = {
  register: (payload) =>
    apiRequest("/api/auth/register", { method: "POST", body: payload }),
  login: (payload) =>
    apiRequest("/api/auth/login", { method: "POST", body: payload }),
  logout: () => apiRequest("/api/auth/logout", { method: "POST" }),
  me: (options) => apiRequest("/api/auth/me", options),
};
