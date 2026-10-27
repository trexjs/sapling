import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiFile, FiFolder, FiStar, FiShare2, FiUpload, FiSearch } from 'react-icons/fi';
import { apiService } from '../services/api';
import type { File, Folder } from '../types';
import { ContentWrapper, PageHeader, PageTitle, PageActions, Card, CardHeader, CardTitle, CardContent, Grid, EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription } from '../components/Layout/Layout.styles';
import { Button } from '../components/Common/Button';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { FileUpload } from '../components/Upload/FileUpload';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RecentItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RecentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.paper};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: ${({ theme }) => theme.colors.shadow.light};
  }
`;

const ItemIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
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
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const QuickActionButton = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  height: auto;
  min-height: 80px;
`;

const QuickActionIcon = styled.div`
  font-size: 1.5rem;
`;

const QuickActionText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 168) { // 7 days
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalFolders: 0,
    starredItems: 0,
    sharedItems: 0,
  });
  const [recentItems, setRecentItems] = useState<(File | Folder)[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load folder contents (root level)
      const folderContents = await apiService.getFolderContents();
      
      // Load starred items
      const starredItems = await apiService.getStarredItems();
      
      // Load recent items
      const recentItems = await apiService.getRecentItems();
      
      setStats({
        totalFiles: folderContents.files.length,
        totalFolders: folderContents.folders.length,
        starredItems: starredItems.files.length + starredItems.folders.length,
        sharedItems: 0, // This would need to be fetched from shared endpoint
      });
      
      // Combine recent files and folders, sort by date
      const allRecentItems = [...recentItems.files, ...recentItems.folders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setRecentItems(allRecentItems);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    loadDashboardData(); // Refresh data
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <ContentWrapper>
      <PageHeader>
        <PageTitle>Dashboard</PageTitle>
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

      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FiFile size={32} />
          </StatIcon>
          <StatValue>{stats.totalFiles}</StatValue>
          <StatLabel>Total Files</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FiFolder size={32} />
          </StatIcon>
          <StatValue>{stats.totalFolders}</StatValue>
          <StatLabel>Total Folders</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FiStar size={32} />
          </StatIcon>
          <StatValue>{stats.starredItems}</StatValue>
          <StatLabel>Starred Items</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FiShare2 size={32} />
          </StatIcon>
          <StatValue>{stats.sharedItems}</StatValue>
          <StatLabel>Shared Items</StatLabel>
        </StatCard>
      </StatsGrid>

      <Grid columns={2}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Items</CardTitle>
          </CardHeader>
          <CardContent>
            {recentItems.length > 0 ? (
              <RecentItems>
                {recentItems.map((item) => (
                  <RecentItem key={item._id}>
                    <ItemIcon>
                      {'filename' in item ? (
                        <FiFile size={20} />
                      ) : (
                        <FiFolder size={20} />
                      )}
                    </ItemIcon>
                    <ItemInfo>
                      <ItemName>
                        {item.name}
                      </ItemName>
                      <ItemMeta>
                        {formatDate(item.createdAt)}
                      </ItemMeta>
                    </ItemInfo>
                  </RecentItem>
                ))}
              </RecentItems>
            ) : (
              <EmptyState>
                <EmptyStateIcon>
                  <FiFile size={48} />
                </EmptyStateIcon>
                <EmptyStateTitle>No recent items</EmptyStateTitle>
                <EmptyStateDescription>
                  Upload some files to see them here
                </EmptyStateDescription>
              </EmptyState>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions>
              <QuickActionButton variant="outline">
                <QuickActionIcon>
                  <FiUpload size={24} />
                </QuickActionIcon>
                <QuickActionText>Upload Files</QuickActionText>
              </QuickActionButton>
              
              <QuickActionButton variant="outline">
                <QuickActionIcon>
                  <FiFolder size={24} />
                </QuickActionIcon>
                <QuickActionText>Create Folder</QuickActionText>
              </QuickActionButton>
              
              <QuickActionButton variant="outline">
                <QuickActionIcon>
                  <FiSearch size={24} />
                </QuickActionIcon>
                <QuickActionText>Search Files</QuickActionText>
              </QuickActionButton>
              
              <QuickActionButton variant="outline">
                <QuickActionIcon>
                  <FiShare2 size={24} />
                </QuickActionIcon>
                <QuickActionText>Share Items</QuickActionText>
              </QuickActionButton>
            </QuickActions>
          </CardContent>
        </Card>
      </Grid>
    </ContentWrapper>
  );
};
