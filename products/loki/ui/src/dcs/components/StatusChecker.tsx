import React, { useState } from 'react';
import styled from 'styled-components';
import { useDCS } from '../context/DCSContext';

const Container = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Button = styled.button<{ loading?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  height: fit-content;
  
  &:hover {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const Result = styled.div<{ status?: boolean }>`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background: ${props => {
    if (props.status === undefined) return '#f8f9fa';
    return props.status ? '#d4edda' : '#f8d7da';
  }};
  border: 1px solid ${props => {
    if (props.status === undefined) return '#e9ecef';
    return props.status ? '#c3e6cb' : '#f5c6cb';
  }};
  color: ${props => {
    if (props.status === undefined) return '#495057';
    return props.status ? '#155724' : '#721c24';
  }};
`;

const ResultTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ResultDetails = styled.div`
  font-size: 0.875rem;
`;

export const StatusChecker: React.FC = () => {
  const { getFlagStatus } = useDCS();
  const [flagName, setFlagName] = useState('');
  const [tenant, setTenant] = useState('');
  const [result, setResult] = useState<{
    status?: boolean;
    flagName?: string;
    tenant?: string;
    error?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagName.trim() || !tenant.trim()) return;

    setLoading(true);
    setResult({});

    try {
      const status = await getFlagStatus(flagName.trim(), tenant.trim());
      setResult({
        status,
        flagName: flagName.trim(),
        tenant: tenant.trim()
      });
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Failed to check status'
      });
    } finally {
      setLoading(false);
    }
  };

  const getResultMessage = () => {
    if (result.error) {
      return {
        title: 'Error',
        details: result.error
      };
    }

    if (result.status !== undefined) {
      return {
        title: `Flag "${result.flagName}" Status for "${result.tenant}"`,
        details: result.status 
          ? '✅ This flag is ACTIVE for the specified tenant'
          : '❌ This flag is INACTIVE for the specified tenant'
      };
    }

    return null;
  };

  const resultMessage = getResultMessage();

  return (
    <Container>
      <Title>Check Flag Status</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="flagName">Flag Name</Label>
          <Input
            id="flagName"
            type="text"
            value={flagName}
            onChange={(e) => setFlagName(e.target.value)}
            placeholder="e.g., enableSearch"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="tenant">Tenant ID</Label>
          <Input
            id="tenant"
            type="text"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            placeholder="e.g., school_001"
            required
          />
        </FormGroup>

        <Button type="submit" loading={loading} disabled={loading}>
          {loading ? 'Checking...' : 'Check Status'}
        </Button>
      </Form>

      {resultMessage && (
        <Result status={result.status}>
          <ResultTitle>{resultMessage.title}</ResultTitle>
          <ResultDetails>{resultMessage.details}</ResultDetails>
        </Result>
      )}
    </Container>
  );
};
