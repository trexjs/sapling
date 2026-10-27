import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DCSFlag, MapFlagToAccountRequest } from '../types';

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
  max-width: 500px;
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

const CurrentAccounts = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const AccountTag = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
  display: inline-block;
`;

interface AccountMappingModalProps {
  flag: DCSFlag;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mappingData: MapFlagToAccountRequest) => Promise<void>;
}

export const AccountMappingModal: React.FC<AccountMappingModalProps> = ({
  flag,
  isOpen,
  onClose,
  onSubmit
}) => {
  const [accountsInput, setAccountsInput] = useState('');
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (flag && isOpen) {
      setAccountsInput(flag.associated_accounts.join(', '));
      setStatus(flag.status);
    }
  }, [flag, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const accounts = accountsInput
        .split(',')
        .map(acc => acc.trim())
        .filter(acc => acc.length > 0);

      await onSubmit({
        name: flag.name,
        associated_accounts: accounts,
        status
      });
      onClose();
    } catch (error) {
      console.error('Error mapping accounts:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Map Accounts for "{flag.name}"</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <CurrentAccounts>
          <Label>Current Associated Accounts:</Label>
          <div style={{ marginTop: '0.5rem' }}>
            {flag.associated_accounts.length > 0 ? (
              flag.associated_accounts.map((account, index) => (
                <AccountTag key={index}>{account}</AccountTag>
              ))
            ) : (
              <span style={{ color: '#666', fontStyle: 'italic' }}>No accounts mapped</span>
            )}
          </div>
        </CurrentAccounts>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="accounts">Associated Accounts</Label>
            <TextArea
              id="accounts"
              value={accountsInput}
              onChange={(e) => setAccountsInput(e.target.value)}
              placeholder="Enter account IDs separated by commas (e.g., school_001, school_002)"
            />
          </FormGroup>

          <FormGroup>
            <CheckboxContainer>
              <Checkbox
                id="status"
                type="checkbox"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
              />
              <Label htmlFor="status">Active Status</Label>
            </CheckboxContainer>
          </FormGroup>

          <Actions>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update Mapping
            </Button>
          </Actions>
        </Form>
      </ModalContent>
    </Modal>
  );
};
