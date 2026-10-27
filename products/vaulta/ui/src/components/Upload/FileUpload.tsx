import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { FiUpload, FiFile, FiX, FiCheck } from 'react-icons/fi';
import { apiService } from '../../services/api';
import type { UploadProgress } from '../../types';
import { Button } from '../Common/Button';
import { LoadingSpinner } from '../Common/LoadingSpinner';

const UploadContainer = styled.div`
  width: 100%;
`;

const DropzoneArea = styled.div<{ isDragActive: boolean; isDragReject: boolean }>`
  border: 2px dashed ${({ theme, isDragActive, isDragReject }) => {
    if (isDragReject) return theme.colors.error.main;
    if (isDragActive) return theme.colors.primary.main;
    return theme.colors.border.medium;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  background-color: ${({ theme, isDragActive, isDragReject }) => {
    if (isDragReject) return theme.colors.error.light + '10';
    if (isDragActive) return theme.colors.primary.light + '10';
    return theme.colors.background.paper;
  }};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background-color: ${({ theme }) => theme.colors.primary.light + '10'};
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const UploadTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const UploadDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FileList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const FileItem = styled.div<{ status: 'uploading' | 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  ${({ status, theme }) => {
    switch (status) {
      case 'success':
        return `border-color: ${theme.colors.success.main}; background-color: ${theme.colors.success.light + '10'};`;
      case 'error':
        return `border-color: ${theme.colors.error.main}; background-color: ${theme.colors.error.light + '10'};`;
      default:
        return '';
    }
  }}
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
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

const FileSize = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ProgressFill = styled.div<{ percentage: number }>`
  width: ${({ percentage }) => percentage}%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary.main};
  transition: width 0.3s ease;
`;

const StatusIcon = styled.div<{ status: 'uploading' | 'success' | 'error' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: ${({ theme, status }) => {
    switch (status) {
      case 'success': return theme.colors.success.main;
      case 'error': return theme.colors.error.main;
      default: return theme.colors.text.secondary;
    }
  }};
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error.light + '20'};
    color: ${({ theme }) => theme.colors.error.main};
  }
`;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface FileUploadItem {
  file: globalThis.File;
  id: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface FileUploadProps {
  folderId?: string;
  onUploadComplete?: (files: any[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
}

export const FileUpload: React.FC<FileUploadProps> = ({
  folderId,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxSize = 100 * 1024 * 1024, // 100MB
  acceptedTypes = ['image/*', 'application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
}) => {
  const [uploadItems, setUploadItems] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: globalThis.File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]?.message || 'File rejected';
      onUploadError?.(error);
      return;
    }

    const newItems: FileUploadItem[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading',
      progress: 0,
    }));

    setUploadItems(prev => [...prev, ...newItems]);
    uploadFiles(newItems);
  }, [folderId, onUploadComplete, onUploadError]);

  const uploadFiles = async (items: FileUploadItem[]) => {
    setIsUploading(true);
    const uploadedFiles: any[] = [];

    for (const item of items) {
      try {
        const response = await apiService.uploadFile(
          item.file,
          folderId,
          (progress: UploadProgress) => {
            setUploadItems(prev => prev.map(prevItem => 
              prevItem.id === item.id 
                ? { ...prevItem, progress: progress.percentage }
                : prevItem
            ));
          }
        );

        if (response.success && response.data) {
          setUploadItems(prev => prev.map(prevItem => 
            prevItem.id === item.id 
              ? { ...prevItem, status: 'success', progress: 100 }
              : prevItem
          ));
          uploadedFiles.push(response.data);
        } else {
          throw new Error(response.message || 'Upload failed');
        }
      } catch (error: any) {
        setUploadItems(prev => prev.map(prevItem => 
          prevItem.id === item.id 
            ? { 
                ...prevItem, 
                status: 'error', 
                error: error.message || 'Upload failed' 
              }
            : prevItem
        ));
        onUploadError?.(error.message || 'Upload failed');
      }
    }

    setIsUploading(false);
    if (uploadedFiles.length > 0) {
      onUploadComplete?.(uploadedFiles);
    }
  };

  const removeFile = (id: string) => {
    setUploadItems(prev => prev.filter(item => item.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    disabled: isUploading,
  });

  return (
    <UploadContainer>
      <DropzoneArea
        {...getRootProps()}
        isDragActive={isDragActive}
        isDragReject={isDragReject}
      >
        <input {...getInputProps()} />
        <UploadIcon>
          <FiUpload size={48} />
        </UploadIcon>
        <UploadTitle>
          {isDragActive ? 'Drop files here' : 'Upload Files'}
        </UploadTitle>
        <UploadDescription>
          Drag and drop files here, or click to select files
        </UploadDescription>
        <Button variant="outline" disabled={isUploading}>
          Select Files
        </Button>
      </DropzoneArea>

      {uploadItems.length > 0 && (
        <FileList>
          {uploadItems.map((item) => (
            <FileItem key={item.id} status={item.status}>
              <FileIcon>
                <FiFile size={20} />
              </FileIcon>
              <FileInfo>
                <FileName>{item.file.name}</FileName>
                <FileSize>{formatFileSize(item.file.size)}</FileSize>
                {item.status === 'uploading' && (
                  <ProgressBar>
                    <ProgressFill percentage={item.progress} />
                  </ProgressBar>
                )}
                {item.error && (
                  <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                    {item.error}
                  </div>
                )}
              </FileInfo>
              <StatusIcon status={item.status}>
                {item.status === 'uploading' && <LoadingSpinner size="sm" text="" />}
                {item.status === 'success' && <FiCheck size={16} />}
                {item.status === 'error' && <FiX size={16} />}
              </StatusIcon>
              <RemoveButton onClick={() => removeFile(item.id)}>
                <FiX size={16} />
              </RemoveButton>
            </FileItem>
          ))}
        </FileList>
      )}
    </UploadContainer>
  );
};
