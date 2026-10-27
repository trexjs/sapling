import React, { useState } from 'react';
import styled from 'styled-components';
import { useConfig } from '../context/ConfigContext';

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
  min-width: 300px;
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

const Result = styled.div<{ success?: boolean }>`
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 4px;
  background: ${props => props.success ? '#d4edda' : '#f8d7da'};
  border: 1px solid ${props => props.success ? '#c3e6cb' : '#f5c6cb'};
  color: ${props => props.success ? '#155724' : '#721c24'};
`;

const ResultTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ResultDetails = styled.div`
  font-size: 0.875rem;
`;

const ConfigPreview = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 1rem;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const ConfigContent = styled.pre`
  margin: 0;
  font-size: 0.75rem;
  color: #495057;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Courier New', monospace;
`;

export const ConfigFetcher: React.FC = () => {
  const { fetchConfig } = useConfig();
  const [configName, setConfigName] = useState('');
  const [result, setResult] = useState<{
    success?: boolean;
    configName?: string;
    config?: any;
    error?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configName.trim()) return;

    setLoading(true);
    setResult({});

    try {
      const config = await fetchConfig(configName.trim());
      setResult({
        success: true,
        configName: configName.trim(),
        config
      });
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch config'
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

    if (result.success && result.config) {
      return {
        title: `Configuration "${result.configName}" loaded successfully`,
        details: `Version: ${result.config.version} | Created: ${new Date(result.config.createdAt).toLocaleDateString()}`
      };
    }

    return null;
  };

  const resultMessage = getResultMessage();

  return (
    <Container>
      <Title>Fetch Configuration</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="configName">Configuration Name</Label>
          <Input
            id="configName"
            type="text"
            value={configName}
            onChange={(e) => setConfigName(e.target.value)}
            placeholder="e.g., app-settings, user-preferences"
            required
          />
        </FormGroup>

        <Button type="submit" loading={loading} disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Config'}
        </Button>
      </Form>

      {resultMessage && (
        <Result success={result.success}>
          <ResultTitle>{resultMessage.title}</ResultTitle>
          <ResultDetails>{resultMessage.details}</ResultDetails>
          
          {result.success && result.config && (
            <ConfigPreview>
              <ConfigContent>
                {JSON.stringify(result.config.data, null, 2)}
              </ConfigContent>
            </ConfigPreview>
          )}
        </Result>
      )}
    </Container>
  );
};
