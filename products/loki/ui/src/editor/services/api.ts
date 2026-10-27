import axios from 'axios';
import { Document, DocumentType } from '../types';

const API_BASE_URL = '/api/cms';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cmsApi = {
  // Get all documents
  getAllDocuments: async (): Promise<Document[]> => {
    try {
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      console.error('Error fetching all documents:', error);
      throw new Error('Failed to fetch documents. Please make sure the server is running.');
    }
  },

  // Get specific document by type
  getDocument: async (type: DocumentType): Promise<Document> => {
    try {
      const response = await api.get(`/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw new Error(`Failed to fetch ${type}. Please make sure the server is running.`);
    }
  },

  // Save document
  saveDocument: async (document: Document & { versionBump?: { type: 'MINOR' | 'MAJOR' } }): Promise<Document> => {
    try {
      const response = await api.post(`/${document.type}`, document);
      return response.data.document;
    } catch (error) {
      console.error('Error saving document:', error);
      throw new Error(`Failed to save ${document.type}. Please make sure the server is running.`);
    }
  },

  // Update document
  updateDocument: async (document: Document): Promise<Document> => {
    try {
      const response = await api.put(`/${document.type}`, document);
      return response.data.document;
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error(`Failed to update ${document.type}. Please make sure the server is running.`);
    }
  },
};
