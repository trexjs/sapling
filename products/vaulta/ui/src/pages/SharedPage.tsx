import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiShare2, FiFile, FiFolder, FiSearch, FiGrid, FiList, FiMoreVertical, FiCopy, FiTrash2, FiUsers, FiX } from 'react-icons/fi';
import { apiService } from '../services/api';
import type { Share, File, Folder } from '../types';
import { ContentWrapper, PageHeader, PageTitle, PageActions, Card, CardContent, EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from '../components/Layout/Layout.styles';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  background: none;
  color: ${({ theme, active }) => 
    active ? theme.colors.primary.main : theme.colors.text.secondary};
  font-weight: ${({ theme, active }) => 
    active ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal};
  cursor: pointer;
  border-bottom: 2px solid ${({ theme, active }) => 
    active ? theme.colors.primary.main : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

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

const ShareInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ShareModal = styled.div<{ isOpen: boolean }>`
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
  max-width: 500px;
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

const PermissionSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.paper};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

type ViewMode = 'grid' | 'list';
type TabType = 'shared-with-me' | 'my-shared';

export const SharedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('shared-with-me');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sharedWithMe, setSharedWithMe] = useState<{ files: File[]; folders: Folder[] }>({ files: [], folders: [] });
  const [myShared, setMyShared] = useState<Share[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ type: 'file' | 'folder'; id: string; name: string } | null>(null);
  const [shareEmails, setShareEmails] = useState('');
  const [sharePermissions, setSharePermissions] = useState<'read' | 'write'>('read');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    loadSharedData();
  }, []);

  const loadSharedData = async () => {
    try {
      setLoading(true);
      const [sharedWithMeData, mySharedData] = await Promise.all([
        apiService.getSharedWithMe(),
        apiService.getMySharedItems()
      ]);
      console.log('SharedPage - Shared with me data:', sharedWithMeData);
      console.log('SharedPage - My shared data:', mySharedData);
      setSharedWithMe(sharedWithMeData);
      setMyShared(mySharedData);
    } catch (error) {
      console.error('Failed to load shared data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!selectedItem || !shareEmails.trim()) return;

    try {
      setSharing(true);
      const emails = shareEmails.split(',').map(email => email.trim()).filter(email => email);
      await apiService.shareItem(selectedItem.id, selectedItem.type, emails, sharePermissions);
      setShareEmails('');
      setShowShareModal(false);
      setSelectedItem(null);
      loadSharedData(); // Refresh shared data
    } catch (error) {
      console.error('Failed to share item:', error);
    } finally {
      setSharing(false);
    }
  };

  const handleRevokeShare = async (shareId: string) => {
    if (window.confirm('Are you sure you want to revoke this share?')) {
      try {
        await apiService.revokeShare(shareId);
        loadSharedData(); // Refresh shared data
      } catch (error) {
        console.error('Failed to revoke share:', error);
      }
    }
  };

  const handleCopyShareLink = (shareToken: string) => {
    const shareUrl = `${window.location.origin}/shared/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    // You could add a toast notification here
  };


  const getCurrentItems = (): any[] => {
    try {
      if (activeTab === 'shared-with-me') {
        console.log('sharedWithMe data:', sharedWithMe);
        const files = Array.isArray(sharedWithMe?.files) ? sharedWithMe.files : [];
        const folders = Array.isArray(sharedWithMe?.folders) ? sharedWithMe.folders : [];
        console.log('files array:', files);
        console.log('folders array:', folders);
        return [...files, ...folders];
      } else {
        console.log('myShared data:', myShared);
        return Array.isArray(myShared) ? myShared : [];
      }
    } catch (error) {
      console.error('Error in getCurrentItems:', error);
      return [];
    }
  };

  const currentItems = getCurrentItems();
  console.log('currentItems:', currentItems);
  const filteredItems = Array.isArray(currentItems) ? currentItems.filter(item => {
    let name = '';
    if (activeTab === 'shared-with-me') {
      // For shared-with-me, use the converted name property
      name = item.name || '';
    } else {
      // For my-shared, use the original itemName property
      name = 'itemName' in item ? item.itemName : ('name' in item ? item.name : '');
    }
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];
  console.log('filteredItems:', filteredItems);

  if (loading) {
    return <LoadingSpinner text="Loading shared items..." />;
  }

  // Additional safety check
  if (!Array.isArray(filteredItems)) {
    console.error('filteredItems is not an array:', filteredItems);
    return (
      <ContentWrapper>
        <PageHeader>
          <PageTitle>Shared</PageTitle>
        </PageHeader>
        <Card>
          <CardContent>
            <EmptyState>
              <EmptyStateIcon>
                <FiShare2 size={48} />
              </EmptyStateIcon>
              <EmptyStateTitle>Error loading shared items</EmptyStateTitle>
              <EmptyStateDescription>
                There was an error loading the shared items. Please try refreshing the page.
              </EmptyStateDescription>
            </EmptyState>
          </CardContent>
        </Card>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <PageHeader>
        <PageTitle>Shared</PageTitle>
        <PageActions>
          <Button
            variant="primary"
            onClick={() => setShowShareModal(true)}
            startIcon={<FiShare2 size={16} />}
          >
            Share Item
          </Button>
        </PageActions>
      </PageHeader>

      <TabsContainer>
        <Tab
          active={activeTab === 'shared-with-me'}
          onClick={() => setActiveTab('shared-with-me')}
        >
          Shared with Me
        </Tab>
        <Tab
          active={activeTab === 'my-shared'}
          onClick={() => setActiveTab('my-shared')}
        >
          My Shared Items
        </Tab>
      </TabsContainer>

      <SearchContainer>
        <Input
          placeholder={`Search ${activeTab === 'shared-with-me' ? 'shared items' : 'my shared items'}...`}
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
          {filteredItems && filteredItems.length > 0 ? (
            viewMode === 'grid' ? (
              <ItemsGrid>
                {filteredItems.map((item) => (
                  <ItemCard key={item._id}>
                    <ItemIcon>
                      {activeTab === 'shared-with-me' ? (
                        // For shared-with-me, use the converted itemType
                        item.itemType === 'file' ? (
                          <FiFile size={32} />
                        ) : item.itemType === 'folder' ? (
                          <FiFolder size={32} />
                        ) : (
                          <FiShare2 size={32} />
                        )
                      ) : (
                        // For my-shared, use the original itemType
                        'itemType' in item && item.itemType === 'File' ? (
                          <FiFile size={32} />
                        ) : 'itemType' in item && item.itemType === 'Folder' ? (
                          <FiFolder size={32} />
                        ) : (
                          <FiShare2 size={32} />
                        )
                      )}
                    </ItemIcon>
                    <ItemName>
                      {activeTab === 'shared-with-me' ? (
                        // For shared-with-me, use the converted name
                        item.name || 'Shared Item'
                      ) : (
                        // For my-shared, use the original itemName
                        'itemName' in item ? item.itemName : ('name' in item ? item.name : 'Shared Item')
                      )}
                    </ItemName>
                    <ItemMeta>
                      {activeTab === 'shared-with-me' && item.shareOwner ? (
                        <>
                          Shared by {typeof item.shareOwner === 'object' ? 
                            `${item.shareOwner.firstName} ${item.shareOwner.lastName}` : 
                            'Unknown User'
                          } • {formatDate(item.createdAt)}
                        </>
                      ) : (
                        formatDate(item.createdAt)
                      )}
                    </ItemMeta>
                    {activeTab === 'my-shared' && 'permissions' in item && (
                      <ShareInfo>
                        <FiUsers size={12} />
                        {Array.isArray(item.permissions) ? item.permissions.join(', ') : item.permissions} access
                      </ShareInfo>
                    )}
                    <ItemActions>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {activeTab === 'my-shared' && 'shareToken' in item && (
                          <ActionButton
                            onClick={() => handleCopyShareLink(item.shareToken)}
                            title="Copy share link"
                          >
                            <FiCopy size={14} />
                          </ActionButton>
                        )}
                        {activeTab === 'my-shared' && (
                          <ActionButton
                            onClick={() => handleRevokeShare(item._id)}
                            title="Revoke share"
                          >
                            <FiTrash2 size={14} />
                          </ActionButton>
                        )}
                      </div>
                      <ActionButton title="More options">
                        <FiMoreVertical size={14} />
                      </ActionButton>
                    </ItemActions>
                  </ItemCard>
                ))}
              </ItemsGrid>
            ) : (
              <ItemsList>
                {filteredItems.map((item) => (
                  <ItemListItem key={item._id}>
                    <ItemListIcon>
                      {activeTab === 'shared-with-me' ? (
                        // For shared-with-me, use the converted itemType
                        item.itemType === 'file' ? (
                          <FiFile size={20} />
                        ) : item.itemType === 'folder' ? (
                          <FiFolder size={20} />
                        ) : (
                          <FiShare2 size={20} />
                        )
                      ) : (
                        // For my-shared, use the original itemType
                        'itemType' in item && item.itemType === 'File' ? (
                          <FiFile size={20} />
                        ) : 'itemType' in item && item.itemType === 'Folder' ? (
                          <FiFolder size={20} />
                        ) : (
                          <FiShare2 size={20} />
                        )
                      )}
                    </ItemListIcon>
                    <ItemListContent>
                      <ItemListName>
                        {activeTab === 'shared-with-me' ? (
                          // For shared-with-me, use the converted name
                          item.name || 'Shared Item'
                        ) : (
                          // For my-shared, use the original itemName
                          'itemName' in item ? item.itemName : ('name' in item ? item.name : 'Shared Item')
                        )}
                      </ItemListName>
                      <ItemListMeta>
                        {activeTab === 'shared-with-me' && item.shareOwner ? (
                          <>
                            Shared by {typeof item.shareOwner === 'object' ? 
                              `${item.shareOwner.firstName} ${item.shareOwner.lastName}` : 
                              'Unknown User'
                            } • {formatDate(item.createdAt)}
                          </>
                        ) : (
                          formatDate(item.createdAt)
                        )}
                      </ItemListMeta>
                    </ItemListContent>
                    <ItemListActions>
                      {activeTab === 'my-shared' && 'shareToken' in item && (
                        <ActionButton
                          onClick={() => handleCopyShareLink(item.shareToken)}
                          title="Copy share link"
                        >
                          <FiCopy size={16} />
                        </ActionButton>
                      )}
                      {activeTab === 'my-shared' && (
                        <ActionButton
                          onClick={() => handleRevokeShare(item._id)}
                          title="Revoke share"
                        >
                          <FiTrash2 size={16} />
                        </ActionButton>
                      )}
                      <ActionButton title="More options">
                        <FiMoreVertical size={16} />
                      </ActionButton>
                    </ItemListActions>
                  </ItemListItem>
                ))}
              </ItemsList>
            )
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <FiShare2 size={48} />
              </EmptyStateIcon>
              <EmptyStateTitle>No shared items found</EmptyStateTitle>
              <EmptyStateDescription>
                {searchQuery ? 'No items match your search.' : 
                 activeTab === 'shared-with-me' ? 'No one has shared any items with you yet.' :
                 'You haven\'t shared any items yet.'}
              </EmptyStateDescription>
            </EmptyState>
          )}
        </CardContent>
      </Card>

      {/* Share Modal */}
      <ShareModal isOpen={showShareModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Share Item</ModalTitle>
            <CloseButton onClick={() => setShowShareModal(false)}>
              <FiX size={20} />
            </CloseButton>
          </ModalHeader>
          
          <Input
            label="Email Addresses"
            placeholder="Enter email addresses (comma separated)"
            value={shareEmails}
            onChange={(e) => setShareEmails(e.target.value)}
            fullWidth
            helperText="Separate multiple emails with commas"
          />
          
          <PermissionSelect
            value={sharePermissions}
            onChange={(e) => setSharePermissions(e.target.value as 'read' | 'write')}
          >
            <option value="read">Read Only</option>
            <option value="write">Read & Write</option>
          </PermissionSelect>
          
          <ModalActions>
            <Button
              variant="outline"
              onClick={() => setShowShareModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleShare}
              loading={sharing}
              disabled={!shareEmails.trim()}
              fullWidth
            >
              Share
            </Button>
          </ModalActions>
        </ModalContent>
      </ShareModal>
    </ContentWrapper>
  );
};
