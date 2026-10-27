export type DocumentType = 'terms-and-conditions' | 'privacy-policy';

export type VersionType = 'MINOR' | 'MAJOR';

export interface Document {
  id?: string;
  type: DocumentType;
  title: string;
  content: string;
  version: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VersionBump {
  type: VersionType;
  currentVersion: string;
  newVersion: string;
}

export interface CMSState {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  error: string | null;
}

export interface CMSContextType extends CMSState {
  // Actions
  setCurrentDocument: (document: Document | null) => void;
  updateDocumentContent: (content: string) => void;
  updateDocumentTitle: (title: string) => void;
  setDocumentType: (type: DocumentType) => void;
  saveDocument: (versionBump: VersionBump) => Promise<void>;
  loadDocuments: () => Promise<void>;
  loadDocument: (type: DocumentType) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
