import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Common/Button';
import { Input } from '../components/Common/Input';

const RegisterContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main} 0%, ${({ theme }) => theme.colors.primary.dark} 100%);
  padding: ${({ theme }) => theme.spacing.lg};
`;

const RegisterCard = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.colors.shadow.large};
  padding: ${({ theme }) => theme.spacing.xxl};
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const LogoIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LogoTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const LogoSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error.light + '20'};
  border: 1px solid ${({ theme }) => theme.colors.error.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error.main};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
`;


const PasswordRequirements = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RequirementItem = styled.div<{ isValid: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme, isValid }) => isValid ? theme.colors.success.main : theme.colors.text.secondary};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormFooter = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const FooterText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);
  const doPasswordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!doPasswordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await register(formData.username, formData.email, formData.password, formData.firstName, formData.lastName);
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <LogoSection>
          <LogoIcon>📄</LogoIcon>
          <LogoTitle>Document Master</LogoTitle>
          <LogoSubtitle>Create your account</LogoSubtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Input
            type="text"
            label="Username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            startIcon={<FiUser size={16} />}
            required
            fullWidth
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            startIcon={<FiMail size={16} />}
            required
            fullWidth
          />

          <Input
            type="text"
            label="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            startIcon={<FiUser size={16} />}
            required
            fullWidth
          />

          <Input
            type="text"
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            startIcon={<FiUser size={16} />}
            required
            fullWidth
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            startIcon={<FiLock size={16} />}
            endIcon={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            }
            required
            fullWidth
          />

          {formData.password && (
            <PasswordRequirements>
              <RequirementItem isValid={passwordValidation.length}>
                <span>{passwordValidation.length ? '✓' : '○'}</span>
                At least 8 characters
              </RequirementItem>
              <RequirementItem isValid={passwordValidation.uppercase}>
                <span>{passwordValidation.uppercase ? '✓' : '○'}</span>
                One uppercase letter
              </RequirementItem>
              <RequirementItem isValid={passwordValidation.lowercase}>
                <span>{passwordValidation.lowercase ? '✓' : '○'}</span>
                One lowercase letter
              </RequirementItem>
              <RequirementItem isValid={passwordValidation.number}>
                <span>{passwordValidation.number ? '✓' : '○'}</span>
                One number
              </RequirementItem>
              <RequirementItem isValid={passwordValidation.special}>
                <span>{passwordValidation.special ? '✓' : '○'}</span>
                One special character
              </RequirementItem>
            </PasswordRequirements>
          )}

          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            startIcon={<FiLock size={16} />}
            endIcon={
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            }
            required
            fullWidth
            error={formData.confirmPassword && !doPasswordsMatch ? 'Passwords do not match' : ''}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            disabled={!formData.username || !formData.email || !formData.firstName || !formData.lastName || !isPasswordValid || !doPasswordsMatch}
          >
            Create Account
          </Button>
        </Form>

        <FormFooter>
          <FooterText>
            Already have an account?{' '}
            <FooterLink to="/login">Sign in</FooterLink>
          </FooterText>
        </FormFooter>
      </RegisterCard>
    </RegisterContainer>
  );
};
