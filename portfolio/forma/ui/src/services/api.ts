import axios from "axios";
import { Form, Response, ResponseStats } from "../types";

const API_BASE_URL = "/typeform/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Form API
export const formAPI = {
  getAll: async (): Promise<Form[]> => {
    const response = await api.get("/forms");
    return response.data;
  },

  getById: async (id: string): Promise<Form> => {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },

  create: async (formData: Partial<Form>): Promise<Form> => {
    const response = await api.post("/forms", formData);
    return response.data;
  },

  update: async (id: string, formData: Partial<Form>): Promise<Form> => {
    const response = await api.put(`/forms/${id}`, formData);
    return response.data;
  },

  publish: async (id: string, isPublished: boolean): Promise<Form> => {
    const response = await api.patch(`/forms/${id}/publish`, { isPublished });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/forms/${id}`);
  },
};

// Response API
export const responseAPI = {
  submit: async (
    formId: string,
    answers: any[],
    userEmail?: string
  ): Promise<Response> => {
    const response = await api.post("/responses", {
      formId,
      answers,
      userEmail,
    });
    return response.data;
  },

  getByFormId: async (formId: string): Promise<Response[]> => {
    const response = await api.get(`/responses/form/${formId}`);
    return response.data;
  },

  getStats: async (formId: string): Promise<ResponseStats> => {
    const response = await api.get(`/responses/stats/${formId}`);
    return response.data;
  },
};

export default api;
