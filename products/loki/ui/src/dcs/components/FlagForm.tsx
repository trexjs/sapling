import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DCSFlag, CreateOrUpdateFlagRequest, POC } from '../types';

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
  max-width: 600px;
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
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
`;

const POCSection = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  background: #f8f9fa;
`;

const POCSectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #333;
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

interface FlagFormProps {
  flag?: DCSFlag;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (flagData: CreateOrUpdateFlagRequest) => Promise<void>;
}

export const FlagForm: React.FC<FlagFormProps> = ({ flag, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateOrUpdateFlagRequest>({
    name: '',
    exp: '1hr',
    type: 'NO_EXP',
    created_by: '',
    updated_by: '',
    poc: {
      name: '',
      escalation_mail: '',
      oncall_id: ''
    },
    associated_accounts: [],
    status: false
  });

  const [accountsInput, setAccountsInput] = useState('');

  useEffect(() => {
    if (flag) {
      setFormData({
        name: flag.name,
        exp: flag.exp,
        type: flag.type,
        created_by: flag.created_by,
        updated_by: flag.updated_by,
        poc: flag.poc,
        associated_accounts: flag.associated_accounts,
        status: flag.status
      });
      setAccountsInput(flag.associated_accounts.join(', '));
    } else {
      setFormData({
        name: '',
        exp: '1hr',
        type: 'NO_EXP',
        created_by: '',
        updated_by: '',
        poc: {
          name: '',
          escalation_mail: '',
          oncall_id: ''
        },
        associated_accounts: [],
        status: false
      });
      setAccountsInput('');
    }
  }, [flag, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePOCChange = (field: keyof POC, value: string) => {
    setFormData(prev => ({
      ...prev,
      poc: {
        ...prev.poc,
        [field]: value
      }
    }));
  };

  const handleAccountsChange = (value: string) => {
    setAccountsInput(value);
    const accounts = value.split(',').map(acc => acc.trim()).filter(acc => acc.length > 0);
    setFormData(prev => ({
      ...prev,
      associated_accounts: accounts
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
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
          <Title>{flag ? 'Edit Flag' : 'Create New Flag'}</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Flag Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="exp">Expiry</Label>
            <Input
              id="exp"
              type="text"
              value={formData.exp}
              onChange={(e) => handleInputChange('exp', e.target.value)}
              placeholder="e.g., 1hr, 30days"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value as 'EXP' | 'NO_EXP')}
            >
              <option value="NO_EXP">No Expiry</option>
              <option value="EXP">With Expiry</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="created_by">Created By</Label>
            <Input
              id="created_by"
              type="text"
              value={formData.created_by}
              onChange={(e) => handleInputChange('created_by', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="updated_by">Updated By</Label>
            <Input
              id="updated_by"
              type="text"
              value={formData.updated_by}
              onChange={(e) => handleInputChange('updated_by', e.target.value)}
            />
          </FormGroup>

          <POCSection>
            <POCSectionTitle>Point of Contact (POC)</POCSectionTitle>
            
            <FormGroup>
              <Label htmlFor="poc_name">POC Name</Label>
              <Input
                id="poc_name"
                type="text"
                value={formData.poc?.name || ''}
                onChange={(e) => handlePOCChange('name', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="poc_email">Escalation Email</Label>
              <Input
                id="poc_email"
                type="email"
                value={formData.poc?.escalation_mail || ''}
                onChange={(e) => handlePOCChange('escalation_mail', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="poc_oncall">On-call ID</Label>
              <Input
                id="poc_oncall"
                type="text"
                value={formData.poc?.oncall_id || ''}
                onChange={(e) => handlePOCChange('oncall_id', e.target.value)}
              />
            </FormGroup>
          </POCSection>

          <FormGroup>
            <Label htmlFor="accounts">Associated Accounts</Label>
            <TextArea
              id="accounts"
              value={accountsInput}
              onChange={(e) => handleAccountsChange(e.target.value)}
              placeholder="Enter account IDs separated by commas (e.g., school_001, school_002)"
            />
          </FormGroup>

          <FormGroup>
            <CheckboxContainer>
              <Checkbox
                id="status"
                type="checkbox"
                checked={formData.status}
                onChange={(e) => handleInputChange('status', e.target.checked)}
              />
              <Label htmlFor="status">Active Status</Label>
            </CheckboxContainer>
          </FormGroup>

          <Actions>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {flag ? 'Update Flag' : 'Create Flag'}
            </Button>
          </Actions>
        </Form>
      </ModalContent>
    </Modal>
  );
};
