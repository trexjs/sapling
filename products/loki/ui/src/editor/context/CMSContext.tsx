import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { CMSState, CMSContextType, Document, DocumentType, VersionBump } from '../types';
import { cmsApi } from '../services/api';

// Initial state
const initialState: CMSState = {
  documents: [],
  currentDocument: null,
  isLoading: false,
  error: null,
};

// Action types
type CMSAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'SET_CURRENT_DOCUMENT'; payload: Document | null }
  | { type: 'UPDATE_DOCUMENT_CONTENT'; payload: string }
  | { type: 'UPDATE_DOCUMENT_TITLE'; payload: string }
  | { type: 'SET_DOCUMENT_TYPE'; payload: DocumentType };

// Reducer
const cmsReducer = (state: CMSState, action: CMSAction): CMSState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'SET_CURRENT_DOCUMENT':
      return { ...state, currentDocument: action.payload };
    case 'UPDATE_DOCUMENT_CONTENT':
      return {
        ...state,
        currentDocument: state.currentDocument
          ? { ...state.currentDocument, content: action.payload }
          : null,
      };
    case 'UPDATE_DOCUMENT_TITLE':
      return {
        ...state,
        currentDocument: state.currentDocument
          ? { ...state.currentDocument, title: action.payload }
          : null,
      };
    case 'SET_DOCUMENT_TYPE':
      return {
        ...state,
        currentDocument: state.currentDocument
          ? { ...state.currentDocument, type: action.payload }
          : null,
      };
    default:
      return state;
  }
};

// Create context
const CMSContext = createContext<CMSContextType | undefined>(undefined);

// Provider component
interface CMSProviderProps {
  children: ReactNode;
}

export const CMSProvider: React.FC<CMSProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cmsReducer, initialState);


  // Actions
  const setCurrentDocument = (document: Document | null) => {
    dispatch({ type: 'SET_CURRENT_DOCUMENT', payload: document });
  };

  const updateDocumentContent = (content: string) => {
    dispatch({ type: 'UPDATE_DOCUMENT_CONTENT', payload: content });
  };

  const updateDocumentTitle = (title: string) => {
    dispatch({ type: 'UPDATE_DOCUMENT_TITLE', payload: title });
  };

  const setDocumentType = (type: DocumentType) => {
    dispatch({ type: 'SET_DOCUMENT_TYPE', payload: type });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const loadDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const documents = await cmsApi.getAllDocuments();
      dispatch({ type: 'SET_DOCUMENTS', payload: documents });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDocument = useCallback(async (type: DocumentType) => {
    try {
      setLoading(true);
      setError(null);
      const document = await cmsApi.getDocument(type);
      setCurrentDocument(document);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load document');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDocument = async (versionBump: VersionBump) => {
    if (!state.currentDocument) {
      throw new Error('No document to save');
    }

    try {
      setLoading(true);
      setError(null);
      
      const documentToSave = {
        ...state.currentDocument,
        versionBump: {
          type: versionBump.type
        }
      };

      const savedDocument = await cmsApi.saveDocument(documentToSave);
      setCurrentDocument(savedDocument);
      
      // Update the documents list
      const updatedDocuments = state.documents.map(doc =>
        doc.type === savedDocument.type ? savedDocument : doc
      );
      dispatch({ type: 'SET_DOCUMENTS', payload: updatedDocuments });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save document');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const contextValue: CMSContextType = {
    ...state,
    setCurrentDocument,
    updateDocumentContent,
    updateDocumentTitle,
    setDocumentType,
    saveDocument,
    loadDocuments,
    loadDocument,
    setLoading,
    setError,
  };

  return (
    <CMSContext.Provider value={contextValue}>
      {children}
    </CMSContext.Provider>
  );
};

// Custom hook to use the context
export const useCMS = (): CMSContextType => {
  const context = useContext(CMSContext);
  if (context === undefined) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
