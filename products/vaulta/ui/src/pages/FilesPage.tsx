import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiFile, FiUpload, FiSearch, FiGrid, FiList, FiMoreVertical, FiDownload, FiTrash2, FiStar } from 'react-icons/fi';
import { apiService } from '../services/api';
import type { File } from '../types';
import { ContentWrapper, PageHeader, PageTitle, PageActions, Card, CardHeader, CardTitle, CardContent, EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from '../components/Layout/Layout.styles';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { FileUpload } from '../components/Upload/FileUpload';

const ViewControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ViewButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, active }) => 
    active ? theme.colors.primary.main : 'transparent'};
  border: 1px solid ${({ theme, active }) => 
    active ? theme.colors.primary.main : theme.colors.border.medium};
  color: ${({ theme, active }) => 
    active ? theme.colors.primary.contrast : theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, active }) => 
      active ? theme.colors.primary.dark : theme.colors.background.secondary};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FileCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: ${({ theme }) => theme.colors.shadow.medium};
  }
`;

const FileListItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: ${({ theme }) => theme.colors.shadow.light};
  }
`;

const FileListIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  flex-shrink: 0;
`;

const FileListContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FileListName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FileListMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FileListActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FileName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FileActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

type ViewMode = 'grid' | 'list';

export const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const folderContents = await apiService.getFolderContents();
      console.log('FilesPage - Loaded data:', folderContents);
      setFiles(folderContents.files);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    loadFiles(); // Refresh files list
  };

  const handleDownload = async (file: File) => {
    try {
      const blob = await apiService.downloadFile(file._id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = async (file: File) => {
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      try {
        await apiService.deleteFile(file._id);
        loadFiles(); // Refresh files list
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleToggleStar = async (file: File) => {
    try {
      await apiService.toggleStar('file', file._id);
      loadFiles(); // Refresh files list
    } catch (error) {
      console.error('Toggle star failed:', error);
    }
  };

  const filteredFiles = files?.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Loading files..." />;
  }

  return (
    <ContentWrapper>
      <PageHeader>
        <PageTitle>Files</PageTitle>
        <PageActions>
          <Button
            variant="primary"
            onClick={() => setShowUpload(true)}
            startIcon={<FiUpload size={16} />}
          >
            Upload Files
          </Button>
        </PageActions>
      </PageHeader>

      {showUpload && (
        <Card style={{ marginBottom: '2rem' }}>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={(error) => console.error('Upload error:', error)}
            />
          </CardContent>
        </Card>
      )}

      <SearchContainer>
        <Input
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startIcon={<FiSearch size={16} />}
          fullWidth
        />
        <ViewControls>
          <ViewButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <FiGrid size={16} />
          </ViewButton>
          <ViewButton
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <FiList size={16} />
          </ViewButton>
        </ViewControls>
      </SearchContainer>

      <Card>
        <CardContent>
          {filteredFiles?.length > 0 ? (
            viewMode === 'grid' ? (
              <FileGrid>
                {filteredFiles?.map((file) => (
                  <FileCard key={file._id}>
                    <FileIcon>
                      <FiFile size={32} />
                    </FileIcon>
                    <FileName>{file.name}</FileName>
                    <FileMeta>
                      {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                    </FileMeta>
                    <FileActions>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <ActionButton
                          onClick={() => handleDownload(file)}
                          title="Download"
                        >
                          <FiDownload size={14} />
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleToggleStar(file)}
                          title={file.isStarred ? 'Unstar' : 'Star'}
                          style={{ color: file.isStarred ? '#f59e0b' : undefined }}
                        >
                          <FiStar size={14} />
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDelete(file)}
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </ActionButton>
                      </div>
                      <ActionButton title="More options">
                        <FiMoreVertical size={14} />
                      </ActionButton>
                    </FileActions>
                  </FileCard>
                ))}
              </FileGrid>
            ) : (
              <FileList>
                {filteredFiles?.map((file) => (
                  <FileListItem key={file._id}>
                    <FileListIcon>
                      <FiFile size={20} />
                    </FileListIcon>
                    <FileListContent>
                      <FileListName>{file.name}</FileListName>
                      <FileListMeta>
                        {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                      </FileListMeta>
                    </FileListContent>
                    <FileListActions>
                      <ActionButton
                        onClick={() => handleDownload(file)}
                        title="Download"
                      >
                        <FiDownload size={16} />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleToggleStar(file)}
                        title={file.isStarred ? 'Unstar' : 'Star'}
                        style={{ color: file.isStarred ? '#f59e0b' : undefined }}
                      >
                        <FiStar size={16} />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDelete(file)}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </ActionButton>
                      <ActionButton title="More options">
                        <FiMoreVertical size={16} />
                      </ActionButton>
                    </FileListActions>
                  </FileListItem>
                ))}
              </FileList>
            )
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <FiFile size={48} />
              </EmptyStateIcon>
              <EmptyStateTitle>No files found</EmptyStateTitle>
              <EmptyStateDescription>
                {searchQuery ? 'No files match your search.' : 'Upload some files to get started.'}
              </EmptyStateDescription>
            </EmptyState>
          )}
        </CardContent>
      </Card>
    </ContentWrapper>
  );
};
