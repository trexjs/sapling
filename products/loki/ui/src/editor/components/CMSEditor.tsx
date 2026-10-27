import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useCMS } from "../context/CMSContext";
import { DocumentType, VersionType } from "../types";
import { cmsApi } from "../services/api";
import QuillEditor from "./QuillEditor";
import DocumentTypeSelector from "./DocumentTypeSelector";
import VersionBumpSelector from "./VersionBumpSelector";

const EditorContainer = styled.div`
  /* max-width: 1200px;
  margin: 0 auto; */
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
`;

const Title = styled.h1`
  color: #333;
  font-size: 28px;
  font-weight: 700;
`;

const Button = styled.button<{ disabled: boolean }>`
  background-color: ${(props) => (props.disabled ? "#ccc" : "#007bff")};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

const FormSection = styled.div`
  margin-bottom: 30px;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ErrorMessage = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const VersionInfo = styled.div`
  background-color: #e7f3ff;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #0066cc;
`;

const ChangesIndicator = styled.div<{ hasChanges: boolean }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) =>
    props.hasChanges ? "#ff6b6b" : "transparent"};
  margin-right: 8px;
  transition: background-color 0.2s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CMSEditor: React.FC = () => {
  const {
    currentDocument,
    isLoading,
    error,
    setDocumentType,
    loadDocument,
    setCurrentDocument,
    setError,
    setLoading,
  } = useCMS();

  const [documentType, setDocumentTypeState] = useState<DocumentType>(
    "terms-and-conditions"
  );
  const [versionType, setVersionType] = useState<VersionType>("MINOR");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Load initial document on mount
  useEffect(() => {
    loadDocument(documentType);
  }, []); // Empty dependency array - only run once on mount

  // Update local state when current document changes
  useEffect(() => {
    if (currentDocument) {
      setTitle(currentDocument.title);
      setContent(currentDocument.content);
      setOriginalTitle(currentDocument.title);
      setOriginalContent(currentDocument.content);
      setHasChanges(false); // Reset changes when new document loads
    } else {
      setTitle("");
      setContent("");
      setOriginalTitle("");
      setOriginalContent("");
      setHasChanges(false);
    }
  }, [currentDocument]);

  // Track changes in title and content
  useEffect(() => {
    const titleChanged = title !== originalTitle;
    const contentChanged = content !== originalContent;
    const hasAnyChanges = titleChanged || contentChanged;
    setHasChanges(hasAnyChanges);
  }, [title, content, originalTitle, originalContent]);

  const handleDocumentTypeChange = async (type: DocumentType) => {
    setDocumentTypeState(type);
    setDocumentType(type);
    // Automatically load the new document type
    await loadDocument(type);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Don't call updateDocumentTitle here as it resets the original values
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    // Don't call updateDocumentContent here as it resets the original values
  };

  const handleSave = async () => {
    if (!currentDocument) {
      setError("No document to save");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }

    if (!content.trim()) {
      setError("Please enter content");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create the document to save with current values
      const documentToSave = {
        ...currentDocument,
        title: title,
        content: content,
        versionBump: {
          type: versionType,
        },
      };

      console.log("Saving document:", documentToSave);

      // Call the API directly with the updated document
      const savedDocument = await cmsApi.saveDocument(documentToSave);

      console.log("Document saved successfully:", savedDocument);

      // Update the context with the saved document
      setCurrentDocument(savedDocument);

      // Reset changes after successful save
      setOriginalTitle(title);
      setOriginalContent(content);
      setHasChanges(false);
    } catch (error) {
      console.error("Save failed:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save document"
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading && !currentDocument) {
    return (
      <EditorContainer>
        <LoadingMessage>Loading document...</LoadingMessage>
      </EditorContainer>
    );
  }

  return (
    <EditorContainer>
      <Header>
        <Title>CMS Editor</Title>
        <ButtonContainer>
          <ChangesIndicator hasChanges={hasChanges} />
          <Button
            disabled={isLoading || !currentDocument || !hasChanges}
            onClick={handleSave}
          >
            {isLoading ? "Saving..." : "Save Document"}
          </Button>
        </ButtonContainer>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <FormSection>
        <DocumentTypeSelector
          value={documentType}
          onChange={handleDocumentTypeChange}
        />
      </FormSection>

      {currentDocument && (
        <VersionInfo>
          <strong>Current Version:</strong> {currentDocument.version} |
          <strong> Last Updated:</strong>{" "}
          {currentDocument.updatedAt
            ? new Date(currentDocument.updatedAt).toLocaleDateString()
            : "Never"}
        </VersionInfo>
      )}

      <FormSection>
        <TitleInput
          type="text"
          placeholder="Enter document title..."
          value={title}
          onChange={handleTitleChange}
        />
      </FormSection>

      <FormSection>
        <QuillEditor
          value={content}
          onChange={handleContentChange}
          placeholder="Enter document content..."
        />
      </FormSection>

      <FormSection>
        <VersionBumpSelector
          currentVersion={currentDocument?.version || "0.0.0"}
          selectedType={versionType}
          onTypeChange={setVersionType}
        />
      </FormSection>
    </EditorContainer>
  );
};

export default CMSEditor;
