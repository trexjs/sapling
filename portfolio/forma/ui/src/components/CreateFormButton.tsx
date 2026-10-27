import React from 'react';
import styled from 'styled-components';
import { FiPlus } from 'react-icons/fi';

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #0056b3;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

interface CreateFormButtonProps {
  onClick: () => void;
}

const CreateFormButton: React.FC<CreateFormButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <FiPlus />
      Create Form
    </Button>
  );
};

export default CreateFormButton;
