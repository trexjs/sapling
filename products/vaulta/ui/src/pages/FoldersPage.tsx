import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiFolder, FiFolderPlus, FiSearch, FiGrid, FiList, FiMoreVertical, FiEdit2, FiTrash2, FiStar, FiX } from 'react-icons/fi';
import { apiService } from '../services/api';
import type { Folder } from '../types';
import { ContentWrapper, PageHeader, PageTitle, PageActions, Card, CardContent, EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from '../components/Layout/Layout.styles';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';

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

const FolderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FolderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FolderCard = styled.div`
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

const FolderListItem = styled.div`
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

const FolderListIcon = styled.div`
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

const FolderListContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FolderListName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FolderListMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FolderListActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FolderIcon = styled.div`
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

const FolderName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FolderMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FolderActions = styled.div`
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

const CreateFolderModal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 90%;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.colors.shadow.large};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
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

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

type ViewMode = 'grid' | 'list';

export const FoldersPage: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const folderContents = await apiService.getFolderContents();
      console.log('FoldersPage - Loaded data:', folderContents);
      setFolders(folderContents.folders);
    } catch (error) {
      console.error('Failed to load folders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      setCreating(true);
      await apiService.createFolder(newFolderName.trim());
      setNewFolderName('');
      setShowCreateModal(false);
      loadFolders(); // Refresh folders list
    } catch (error) {
      console.error('Failed to create folder:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteFolder = async (folder: Folder) => {
    if (window.confirm(`Are you sure you want to delete "${folder.name}"?`)) {
      try {
        await apiService.deleteFolder(folder._id);
        loadFolders(); // Refresh folders list
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleToggleStar = async (folder: Folder) => {
    try {
      await apiService.toggleStar('folder', folder._id);
      loadFolders(); // Refresh folders list
    } catch (error) {
      console.error('Toggle star failed:', error);
    }
  };

  const handleRenameFolder = async (folder: Folder) => {
    const newName = prompt('Enter new folder name:', folder.name);
    if (newName && newName.trim() && newName.trim() !== folder.name) {
      try {
        await apiService.renameFolder(folder._id, newName.trim());
        loadFolders(); // Refresh folders list
      } catch (error) {
        console.error('Rename failed:', error);
      }
    }
  };

  const filteredFolders = folders?.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner text="Loading folders..." />;
  }

  return (
    <ContentWrapper>
      <PageHeader>
        <PageTitle>Folders</PageTitle>
        <PageActions>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            startIcon={<FiFolderPlus size={16} />}
          >
            Create Folder
          </Button>
        </PageActions>
      </PageHeader>

      <SearchContainer>
        <Input
          placeholder="Search folders..."
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
          {filteredFolders?.length > 0 ? (
            viewMode === 'grid' ? (
              <FolderGrid>
                {filteredFolders?.map((folder) => (
                  <FolderCard key={folder._id}>
                    <FolderIcon>
                      <FiFolder size={32} />
                    </FolderIcon>
                    <FolderName>{folder.name}</FolderName>
                    <FolderMeta>
                      Created {formatDate(folder.createdAt)}
                    </FolderMeta>
                    <FolderActions>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <ActionButton
                          onClick={() => handleToggleStar(folder)}
                          title={folder.isStarred ? 'Unstar' : 'Star'}
                          style={{ color: folder.isStarred ? '#f59e0b' : undefined }}
                        >
                          <FiStar size={14} />
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleRenameFolder(folder)}
                          title="Rename"
                        >
                          <FiEdit2 size={14} />
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDeleteFolder(folder)}
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </ActionButton>
                      </div>
                      <ActionButton title="More options">
                        <FiMoreVertical size={14} />
                      </ActionButton>
                    </FolderActions>
                  </FolderCard>
                ))}
              </FolderGrid>
            ) : (
              <FolderList>
                {filteredFolders?.map((folder) => (
                  <FolderListItem key={folder._id}>
                    <FolderListIcon>
                      <FiFolder size={20} />
                    </FolderListIcon>
                    <FolderListContent>
                      <FolderListName>{folder.name}</FolderListName>
                      <FolderListMeta>
                        Created {formatDate(folder.createdAt)}
                      </FolderListMeta>
                    </FolderListContent>
                    <FolderListActions>
                      <ActionButton
                        onClick={() => handleToggleStar(folder)}
                        title={folder.isStarred ? 'Unstar' : 'Star'}
                        style={{ color: folder.isStarred ? '#f59e0b' : undefined }}
                      >
                        <FiStar size={16} />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleRenameFolder(folder)}
                        title="Rename"
                      >
                        <FiEdit2 size={16} />
                      </ActionButton>
                      <ActionButton
                        onClick={() => handleDeleteFolder(folder)}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </ActionButton>
                      <ActionButton title="More options">
                        <FiMoreVertical size={16} />
                      </ActionButton>
                    </FolderListActions>
                  </FolderListItem>
                ))}
              </FolderList>
            )
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <FiFolder size={48} />
              </EmptyStateIcon>
              <EmptyStateTitle>No folders found</EmptyStateTitle>
              <EmptyStateDescription>
                {searchQuery ? 'No folders match your search.' : 'Create your first folder to get started.'}
              </EmptyStateDescription>
            </EmptyState>
          )}
        </CardContent>
      </Card>

      {/* Create Folder Modal */}
      <CreateFolderModal isOpen={showCreateModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create New Folder</ModalTitle>
            <CloseButton onClick={() => setShowCreateModal(false)}>
              <FiX size={20} />
            </CloseButton>
          </ModalHeader>
          
          <Input
            label="Folder Name"
            placeholder="Enter folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            fullWidth
            autoFocus
          />
          
          <ModalActions>
            <Button
              variant="outline"
              onClick={() => setShowCreateModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateFolder}
              loading={creating}
              disabled={!newFolderName.trim()}
              fullWidth
            >
              Create Folder
            </Button>
          </ModalActions>
        </ModalContent>
      </CreateFolderModal>
    </ContentWrapper>
  );
};
