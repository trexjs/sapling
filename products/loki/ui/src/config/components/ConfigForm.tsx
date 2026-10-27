import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Config, CreateConfigRequest, UpdateConfigRequest, ConfigFormData } from '../types';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
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

const Select = styled.select`
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 300px;
  resize: vertical;
  font-family: 'Courier New', monospace;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  ` : `
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  `}
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 0.75rem;
  margin-bottom: 1rem;
`;

const HelpText = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
`;

interface ConfigFormProps {
  config?: Config;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (configData: CreateConfigRequest | UpdateConfigRequest) => Promise<void>;
}

export const ConfigForm: React.FC<ConfigFormProps> = ({ config, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<ConfigFormData>({
    name: '',
    data: '{}',
    bumpType: 'minor'
  });
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (config) {
      setFormData({
        name: config.name,
        data: JSON.stringify(config.data, null, 2),
        bumpType: 'minor'
      });
    } else {
      setFormData({
        name: '',
        data: '{}',
        bumpType: 'minor'
      });
    }
    setJsonError(null);
  }, [config, isOpen]);

  const validateJSON = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      setJsonError(null);
      return true;
    } catch (error) {
      setJsonError(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const handleInputChange = (field: keyof ConfigFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'data') {
      validateJSON(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateJSON(formData.data)) {
      return;
    }

    try {
      const parsedData = JSON.parse(formData.data);
      
      if (config) {
        // Update existing config
        await onSubmit({
          data: parsedData,
          bumpType: formData.bumpType
        });
      } else {
        // Create new config
        await onSubmit({
          name: formData.name,
          data: parsedData,
          bumpType: formData.bumpType
        });
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{config ? 'Edit Configuration' : 'Create New Configuration'}</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          {!config && (
            <FormGroup>
              <Label htmlFor="name">Configuration Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., app-settings, user-preferences"
                required
              />
              <HelpText>Enter a unique name for this configuration bucket</HelpText>
            </FormGroup>
          )}

          <FormGroup>
            <Label htmlFor="bumpType">Version Bump Type</Label>
            <Select
              id="bumpType"
              value={formData.bumpType}
              onChange={(e) => handleInputChange('bumpType', e.target.value as 'major' | 'minor' | 'patch')}
            >
              <option value="patch">Patch (1.0.0 → 1.0.1)</option>
              <option value="minor">Minor (1.0.0 → 1.1.0)</option>
              <option value="major">Major (1.0.0 → 2.0.0)</option>
            </Select>
            <HelpText>
              {formData.bumpType === 'patch' && 'Patch: Bug fixes and small changes'}
              {formData.bumpType === 'minor' && 'Minor: New features, backward compatible'}
              {formData.bumpType === 'major' && 'Major: Breaking changes'}
            </HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="data">Configuration Data (JSON) *</Label>
            <TextArea
              id="data"
              value={formData.data}
              onChange={(e) => handleInputChange('data', e.target.value)}
              placeholder='{"key": "value", "nested": {"property": "value"}}'
              required
            />
            <HelpText>Enter valid JSON configuration data</HelpText>
          </FormGroup>

          {jsonError && (
            <ErrorMessage>
              {jsonError}
            </ErrorMessage>
          )}

          <Actions>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={!!jsonError}
            >
              {config ? 'Update Configuration' : 'Create Configuration'}
            </Button>
          </Actions>
        </Form>
      </ModalContent>
    </Modal>
  );
};
