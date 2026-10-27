import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../../context/AppContext';
import { PrimaryButton, Input, Card, FormGroup, Label, FormRow, Select } from '../styled/CommonComponents';

const RegisterPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  margin: 0;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const RegisterTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const RegisterSubtitle = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #059669;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
  font-size: 0.875rem;

  a {
    color: #3b82f6;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    user_type: 'student' as 'student' | 'teacher' | 'admin',
    school_id: '',
    profile: {
      first_name: '',
      last_name: '',
    },
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useApp();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.phone_number || 
        !formData.password || !formData.confirm_password || 
        !formData.profile.first_name || !formData.profile.last_name || 
        !formData.school_id) {
      setError('Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      await register(formData);
      setSuccess('Registration successful! Please check your email to verify your account.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <RegisterPageContainer>
      <RegisterCard>
        <RegisterTitle>Create Account</RegisterTitle>
        <RegisterSubtitle>Join our school management system</RegisterSubtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <RegisterForm onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label htmlFor="profile.first_name">First Name</Label>
              <Input
                type="text"
                id="profile.first_name"
                name="profile.first_name"
                value={formData.profile.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="profile.last_name">Last Name</Label>
              <Input
                type="text"
                id="profile.last_name"
                name="profile.last_name"
                value={formData.profile.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="user_type">User Type</Label>
              <Select
                id="user_type"
                name="user_type"
                value={formData.user_type}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="school_id">School Code</Label>
              <Input
                type="text"
                id="school_id"
                name="school_id"
                value={formData.school_id}
                onChange={handleChange}
                placeholder="Enter school code (e.g., SCH001)"
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </FormGroup>
          </FormRow>

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Create Account'}
          </PrimaryButton>
        </RegisterForm>

        <LoginLink>
          Already have an account? <Link to="/login">Sign in</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterPageContainer>
  );
};

export default RegisterPage;
