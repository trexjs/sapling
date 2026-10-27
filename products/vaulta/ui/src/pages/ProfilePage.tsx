import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUser, FiMail, FiCalendar, FiEdit2, FiSave, FiX, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import type { User } from '../types';
import { ContentWrapper, PageHeader, PageTitle, Card, CardContent } from '../components/Layout/Layout.styles';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const AvatarSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary.contrast};
  font-size: 3rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  border: 4px solid ${({ theme }) => theme.colors.background.paper};
  box-shadow: ${({ theme }) => theme.colors.shadow.medium};
`;

const AvatarUpload = styled.input`
  display: none;
`;

const AvatarButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.contrast};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.primary.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.primary.main};
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const StorageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StorageBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

const StorageProgress = styled.div<{ percentage: number }>`
  height: 100%;
  width: ${({ percentage }) => Math.min(percentage, 100)}%;
  background-color: ${({ theme, percentage }) => 
    percentage > 90 ? theme.colors.error.main : 
    percentage > 70 ? theme.colors.warning.main : 
    theme.colors.success.main};
  transition: width 0.3s ease;
`;

const StorageInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.success.light};
  color: ${({ theme }) => theme.colors.success.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error.light};
  color: ${({ theme }) => theme.colors.error.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const ProfilePage: React.FC = () => {
  const { updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    avatar: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await apiService.getProfile();
      setUser(profileData);
      setProfileForm({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        avatar: profileData.avatar || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      setErrorMessage('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setErrorMessage('');
      const updatedUser = await apiService.updateProfile(profileForm);
      setUser(updatedUser);
      updateUser(updatedUser);
      setEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Profile update failed:', error);
      setErrorMessage('Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long');
      return;
    }

    try {
      setErrorMessage('');
      await apiService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Password change failed:', error);
      setErrorMessage('Failed to change password. Please check your current password.');
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server and get a URL
      // For now, we'll just use a placeholder
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileForm(prev => ({ ...prev, avatar: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getUserInitials = (user: User) => {
    if (user.fullName) {
      return user.fullName
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user.username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const storagePercentage = user ? (user.storageUsed / user.maxStorage) * 100 : 0;

  if (loading) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  if (!user) {
    return (
      <ContentWrapper>
        <PageHeader>
          <PageTitle>Profile</PageTitle>
        </PageHeader>
        <ErrorMessage>Failed to load profile information</ErrorMessage>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <PageHeader>
        <PageTitle>Profile</PageTitle>
      </PageHeader>

      {successMessage && (
        <SuccessMessage>
          <FiCheck size={16} />
          {successMessage}
        </SuccessMessage>
      )}

      {errorMessage && (
        <ErrorMessage>
          <FiX size={16} />
          {errorMessage}
        </ErrorMessage>
      )}

      <ProfileContainer>
        <ProfileGrid>
          {/* Left Column - Avatar and Basic Info */}
          <Card>
            <CardContent>
              <AvatarSection>
                <AvatarContainer>
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    getUserInitials(user)
                  )}
                </AvatarContainer>
                
                <AvatarUpload
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  id="avatar-upload"
                />
                <AvatarButton as="label" htmlFor="avatar-upload">
                  <FiEdit2 size={16} style={{ marginRight: '8px' }} />
                  Change Avatar
                </AvatarButton>

                <UserInfo>
                  <InfoItem>
                    <InfoIcon>
                      <FiUser size={20} />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Full Name</InfoLabel>
                      <InfoValue>{user.fullName || `${user.firstName} ${user.lastName}`}</InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <FiMail size={20} />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Email</InfoLabel>
                      <InfoValue>{user.email}</InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <FiUser size={20} />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Username</InfoLabel>
                      <InfoValue>{user.username}</InfoValue>
                    </InfoContent>
                  </InfoItem>

                  <InfoItem>
                    <InfoIcon>
                      <FiCalendar size={20} />
                    </InfoIcon>
                    <InfoContent>
                      <InfoLabel>Last Login</InfoLabel>
                      <InfoValue>
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </InfoValue>
                    </InfoContent>
                  </InfoItem>
                </UserInfo>
              </AvatarSection>
            </CardContent>
          </Card>

          {/* Right Column - Forms and Storage */}
          <div>
            {/* Profile Edit Form */}
            <Card>
              <CardContent>
                <FormSection>
                  <FormHeader>
                    <FormTitle>Profile Information</FormTitle>
                    <Button
                      variant={editing ? "outline" : "primary"}
                      onClick={() => {
                        setEditing(!editing);
                        if (editing) {
                          setProfileForm({
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            avatar: user.avatar || ''
                          });
                        }
                      }}
                      startIcon={editing ? <FiX size={16} /> : <FiEdit2 size={16} />}
                    >
                      {editing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </FormHeader>

                  {editing ? (
                    <>
                      <FormGrid>
                        <Input
                          label="First Name"
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="Enter first name"
                        />
                        <Input
                          label="Last Name"
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Enter last name"
                        />
                      </FormGrid>
                      <FormActions>
                        <Button
                          variant="primary"
                          onClick={handleProfileUpdate}
                          startIcon={<FiSave size={16} />}
                        >
                          Save Changes
                        </Button>
                      </FormActions>
                    </>
                  ) : (
                    <div>
                      <p style={{ color: '#666', margin: 0 }}>
                        Click "Edit Profile" to update your personal information.
                      </p>
                    </div>
                  )}
                </FormSection>
              </CardContent>
            </Card>

            {/* Password Change Form */}
            <Card>
              <CardContent>
                <FormSection>
                  <FormHeader>
                    <FormTitle>Change Password</FormTitle>
                    <Button
                      variant={changingPassword ? "outline" : "primary"}
                      onClick={() => {
                        setChangingPassword(!changingPassword);
                        if (changingPassword) {
                          setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        }
                      }}
                      startIcon={changingPassword ? <FiX size={16} /> : <FiEdit2 size={16} />}
                    >
                      {changingPassword ? 'Cancel' : 'Change Password'}
                    </Button>
                  </FormHeader>

                  {changingPassword && (
                    <>
                      <Input
                        label="Current Password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Enter current password"
                        endIcon={
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            {showCurrentPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        }
                      />
                      <Input
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Enter new password"
                        endIcon={
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        }
                      />
                      <Input
                        label="Confirm New Password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm new password"
                        endIcon={
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        }
                      />
                      <FormActions>
                        <Button
                          variant="primary"
                          onClick={handlePasswordChange}
                          startIcon={<FiSave size={16} />}
                        >
                          Change Password
                        </Button>
                      </FormActions>
                    </>
                  )}
                </FormSection>
              </CardContent>
            </Card>

            {/* Storage Information */}
            <Card>
              <CardContent>
                <FormSection>
                  <FormTitle>Storage Usage</FormTitle>
                  <StorageSection>
                    <StorageInfo>
                      <span>Used: {formatFileSize(user.storageUsed)}</span>
                      <span>Available: {formatFileSize(user.maxStorage - user.storageUsed)}</span>
                    </StorageInfo>
                    <StorageBar>
                      <StorageProgress percentage={storagePercentage} />
                    </StorageBar>
                    <StorageInfo>
                      <span>{storagePercentage.toFixed(1)}% used</span>
                      <span>Total: {formatFileSize(user.maxStorage)}</span>
                    </StorageInfo>
                  </StorageSection>
                </FormSection>
              </CardContent>
            </Card>
          </div>
        </ProfileGrid>
      </ProfileContainer>
    </ContentWrapper>
  );
};
