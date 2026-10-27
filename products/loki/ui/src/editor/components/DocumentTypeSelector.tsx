import React from 'react';
import styled from 'styled-components';
import { DocumentType } from '../types';

const SelectorContainer = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  &:hover {
    border-color: #007bff;
  }
`;

interface DocumentTypeSelectorProps {
  value: DocumentType;
  onChange: (type: DocumentType) => void;
}

const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({ value, onChange }) => {
  const options = [
    { value: 'terms-and-conditions', label: 'Terms and Conditions' },
    { value: 'privacy-policy', label: 'Privacy Policy' },
  ];

  return (
    <SelectorContainer>
      <Label htmlFor="document-type">Document Type</Label>
      <Select
        id="document-type"
        value={value}
        onChange={(e) => onChange(e.target.value as DocumentType)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </SelectorContainer>
  );
};

export default DocumentTypeSelector;
