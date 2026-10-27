import React, { useState } from 'react';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent, PrimaryButton, SecondaryButton, Input, FormGroup, Label, FormRow } from '../components/styled/CommonComponents';

const SettingsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

type SettingsView = 'main' | 'changePassword' | 'updateProfile';

const SettingsPage: React.FC = () => {
  const { user } = useApp();
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  
  // Change Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update Profile Form State
  const [profileData, setProfileData] = useState({
    first_name: user?.profile?.first_name || '',
    last_name: user?.profile?.last_name || '',
    phone_number: user?.phone_number || ''
  });

  // Form Handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      // TODO: Implement change password API call
      console.log('Changing password:', passwordData);
      alert('Password changed successfully!');
      setCurrentView('main');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // TODO: Implement update profile API call
      console.log('Updating profile:', profileData);
      alert('Profile updated successfully!');
      setCurrentView('main');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setCurrentView('main');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Change Password Form
  if (currentView === 'changePassword') {
    return (
      <FormContainer>
        <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>
          Change Password
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Update Your Password</CardTitle>
          </CardHeader>
          <CardContent>
            <FormGroup>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your new password"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm your new password"
                required
              />
            </FormGroup>

            <ButtonGroup>
              <PrimaryButton onClick={handleChangePassword}>
                Change Password
              </PrimaryButton>
              <SecondaryButton onClick={handleCancel}>
                Cancel
              </SecondaryButton>
            </ButtonGroup>
          </CardContent>
        </Card>
      </FormContainer>
    );
  }

  // Update Profile Form
  if (currentView === 'updateProfile') {
    return (
      <FormContainer>
        <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>
          Update Profile
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Update Your Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormRow>
              <FormGroup>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={profileData.first_name}
                  onChange={handleProfileChange}
                  placeholder="Enter your first name"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={profileData.last_name}
                  onChange={handleProfileChange}
                  placeholder="Enter your last name"
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={profileData.phone_number}
                onChange={handleProfileChange}
                placeholder="Enter your phone number"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">Email (Read Only)</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
              />
            </FormGroup>

            <ButtonGroup>
              <PrimaryButton onClick={handleUpdateProfile}>
                Update Profile
              </PrimaryButton>
              <SecondaryButton onClick={handleCancel}>
                Cancel
              </SecondaryButton>
            </ButtonGroup>
          </CardContent>
        </Card>
      </FormContainer>
    );
  }

  // Main Settings View
  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '700' }}>
        Settings
      </h1>

      <SettingsContainer>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormRow>
              <FormGroup>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={user?.profile?.first_name || ''}
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={user?.profile?.last_name || ''}
                  disabled
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={user?.phone_number || ''}
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="user_type">User Type</Label>
              <Input
                id="user_type"
                value={user?.user_type || ''}
                disabled
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="school_id">School ID</Label>
              <Input
                id="school_id"
                value={user?.school_id || ''}
                disabled
              />
            </FormGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <PrimaryButton onClick={() => setCurrentView('changePassword')}>
                Change Password
              </PrimaryButton>
              
              <PrimaryButton onClick={() => setCurrentView('updateProfile')}>
                Update Profile
              </PrimaryButton>
            </div>
          </CardContent>
        </Card>
      </SettingsContainer>

      <Card style={{ marginTop: '2rem' }}>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Version:</strong> 1.0.0
            </div>
            <div>
              <strong>Last Login:</strong> {user?.last_login ? new Date(user.last_login).toLocaleString() : 'N/A'}
            </div>
            <div>
              <strong>Account Status:</strong> {user?.is_active ? 'Active' : 'Inactive'}
            </div>
            <div>
              <strong>Email Verified:</strong> {user?.is_verified ? 'Yes' : 'No'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
