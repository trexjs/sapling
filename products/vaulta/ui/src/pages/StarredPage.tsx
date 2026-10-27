import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiStar, FiFile, FiFolder, FiSearch, FiGrid, FiList, FiMoreVertical, FiDownload, FiTrash2 } from 'react-icons/fi';
import { apiService } from '../services/api';
import type { File, Folder } from '../types';
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

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ItemCard = styled.div`
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

const ItemListItem = styled.div`
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

const ItemListIcon = styled.div`
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

const ItemListContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ItemListName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ItemListMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ItemListActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ItemIcon = styled.div`
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

const ItemName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemMeta = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ItemActions = styled.div`
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

const StarredBadge = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.warning.main};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.warning.main};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
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

export const StarredPage: React.FC = () => {
  const [starredItems, setStarredItems] = useState<{ files: File[]; folders: Folder[] }>({ files: [], folders: [] });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStarredItems();
  }, []);

  const loadStarredItems = async () => {
    try {
      setLoading(true);
      const starredData = await apiService.getStarredItems();
      console.log('StarredPage - Loaded starred data:', starredData);
      setStarredItems(starredData);
    } catch (error) {
      console.error('Failed to load starred items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStar = async (item: File | Folder, type: 'file' | 'folder') => {
    try {
      await apiService.toggleStar(type, item._id);
      loadStarredItems(); // Refresh starred items
    } catch (error) {
      console.error('Toggle star failed:', error);
    }
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

  const handleDelete = async (item: File | Folder, type: 'file' | 'folder') => {
    const name = item.name;
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        if (type === 'file') {
          await apiService.deleteFile(item._id);
        } else {
          await apiService.deleteFolder(item._id);
        }
        loadStarredItems(); // Refresh starred items
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const allStarredItems = [...(starredItems?.files || []), ...(starredItems?.folders || [])];
  console.log('StarredPage - allStarredItems:', allStarredItems);
  const filteredItems = allStarredItems?.filter(item => {
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];
  console.log('StarredPage - filteredItems:', filteredItems);

  const totalSize = (starredItems?.files || []).reduce((sum, file) => sum + file.size, 0);

  if (loading) {
    return <LoadingSpinner text="Loading starred items..." />;
  }

  return (
    <ContentWrapper>
      <PageHeader>
        <PageTitle>Starred Items</PageTitle>
        <PageActions>
          <Button
            variant="outline"
            onClick={loadStarredItems}
            startIcon={<FiStar size={16} />}
          >
            Refresh
          </Button>
        </PageActions>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatIcon>
            <FiStar size={32} />
          </StatIcon>
          <StatValue>{allStarredItems.length}</StatValue>
          <StatLabel>Total Starred</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FiFile size={32} />
          </StatIcon>
          <StatValue>{starredItems?.files?.length}</StatValue>
          <StatLabel>Starred Files</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FiFolder size={32} />
          </StatIcon>
          <StatValue>{starredItems?.folders?.length}</StatValue>
          <StatLabel>Starred Folders</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FiDownload size={32} />
          </StatIcon>
          <StatValue>{formatFileSize(totalSize)}</StatValue>
          <StatLabel>Total Size</StatLabel>
        </StatCard>
      </StatsContainer>

      <SearchContainer>
        <Input
          placeholder="Search starred items..."
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
          {filteredItems.length > 0 ? (
            viewMode === 'grid' ? (
              <ItemsGrid>
                {filteredItems.map((item) => {
                  const isFile = 'filename' in item;
                  const type = isFile ? 'file' : 'folder';
                  
                  return (
                    <ItemCard key={item._id}>
                      <ItemIcon>
                        {isFile ? (
                          <FiFile size={32} />
                        ) : (
                          <FiFolder size={32} />
                        )}
                      </ItemIcon>
                      <ItemName>
                        {item.name}
                      </ItemName>
                      <ItemMeta>
                        {isFile ? formatFileSize((item as File).size) : 'Folder'} • {formatDate(item.createdAt)}
                      </ItemMeta>
                      <StarredBadge>
                        <FiStar size={12} />
                        Starred
                      </StarredBadge>
                      <ItemActions>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {isFile && (
                            <ActionButton
                              onClick={() => handleDownload(item as File)}
                              title="Download"
                            >
                              <FiDownload size={14} />
                            </ActionButton>
                          )}
                          <ActionButton
                            onClick={() => handleToggleStar(item, type)}
                            title="Unstar"
                            style={{ color: '#f59e0b' }}
                          >
                            <FiStar size={14} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleDelete(item, type)}
                            title="Delete"
                          >
                            <FiTrash2 size={14} />
                          </ActionButton>
                        </div>
                        <ActionButton title="More options">
                          <FiMoreVertical size={14} />
                        </ActionButton>
                      </ItemActions>
                    </ItemCard>
                  );
                })}
              </ItemsGrid>
            ) : (
              <ItemsList>
                {filteredItems.map((item) => {
                  const isFile = 'filename' in item;
                  const type = isFile ? 'file' : 'folder';
                  
                  return (
                    <ItemListItem key={item._id}>
                      <ItemListIcon>
                        {isFile ? (
                          <FiFile size={20} />
                        ) : (
                          <FiFolder size={20} />
                        )}
                      </ItemListIcon>
                      <ItemListContent>
                        <ItemListName>
                          {item.name}
                        </ItemListName>
                        <ItemListMeta>
                          {isFile ? formatFileSize((item as File).size) : 'Folder'} • {formatDate(item.createdAt)}
                        </ItemListMeta>
                      </ItemListContent>
                      <ItemListActions>
                        {isFile && (
                          <ActionButton
                            onClick={() => handleDownload(item as File)}
                            title="Download"
                          >
                            <FiDownload size={16} />
                          </ActionButton>
                        )}
                        <ActionButton
                          onClick={() => handleToggleStar(item, type)}
                          title="Unstar"
                          style={{ color: '#f59e0b' }}
                        >
                          <FiStar size={16} />
                        </ActionButton>
                        <ActionButton
                          onClick={() => handleDelete(item, type)}
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </ActionButton>
                        <ActionButton title="More options">
                          <FiMoreVertical size={16} />
                        </ActionButton>
                      </ItemListActions>
                    </ItemListItem>
                  );
                })}
              </ItemsList>
            )
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <FiStar size={48} />
              </EmptyStateIcon>
              <EmptyStateTitle>No starred items found</EmptyStateTitle>
              <EmptyStateDescription>
                {searchQuery ? 'No starred items match your search.' : 'Star files and folders to see them here.'}
              </EmptyStateDescription>
            </EmptyState>
          )}
        </CardContent>
      </Card>
    </ContentWrapper>
  );
};
