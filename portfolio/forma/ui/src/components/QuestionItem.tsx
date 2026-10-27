import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { Question } from '../types';
import { FiMove, FiCopy, FiTrash2 } from 'react-icons/fi';

const Item = styled.div<{ $isSelected: boolean; $isDragging: boolean }>`
  position: relative;
  margin-bottom: 1rem;
  padding: 1.5rem;
  border: 2px solid ${props => props.$isSelected ? '#007bff' : '#e9ecef'};
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${props => props.$isDragging ? 0.5 : 1};

  &:hover {
    border-color: ${props => props.$isSelected ? '#007bff' : '#dee2e6'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const DragHandle = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem;
  color: #666;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const QuestionTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
`;

const QuestionType = styled.span`
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const QuestionPreview = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const RequiredBadge = styled.span`
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #dc3545;
  color: white;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${Item}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button<{ variant?: 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: ${props => props.variant === 'danger' ? '#dc3545' : 'white'};
  color: ${props => props.variant === 'danger' ? 'white' : '#666'};
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#c82333' : '#f8f9fa'};
  }
`;

interface QuestionItemProps {
  question: Question;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'question',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDuplicate();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this question?')) {
      onDelete();
    }
  };

  const renderPreview = () => {
    switch (question.type) {
      case 'text':
      case 'email':
        return <input type="text" placeholder={question.placeholder || 'Enter your answer'} disabled />;
      case 'textarea':
        return <textarea placeholder={question.placeholder || 'Enter your answer'} disabled />;
      case 'number':
        return <input type="number" placeholder={question.placeholder || 'Enter a number'} disabled />;
      case 'select':
        return (
          <select disabled>
            <option>Choose an option</option>
            {question.options?.map((option, i) => (
              <option key={i}>{option}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div>
            {question.options?.map((option, i) => (
              <label key={i} style={{ display: 'block', marginBottom: '0.5rem' }}>
                <input type="radio" name={`preview-${question.id}`} disabled />
                {option}
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <div>
            {question.options?.map((option, i) => (
              <label key={i} style={{ display: 'block', marginBottom: '0.5rem' }}>
                <input type="checkbox" disabled />
                {option}
              </label>
            ))}
          </div>
        );
      case 'rating':
        return (
          <div>
            {Array.from({ length: question.max || 5 }, (_, i) => (
              <span key={i} style={{ fontSize: '1.5rem', color: '#ffc107' }}>★</span>
            ))}
          </div>
        );
      case 'date':
        return <input type="date" disabled />;
      default:
        return null;
    }
  };

  return (
    <Item
      ref={drag}
      $isSelected={isSelected}
      $isDragging={isDragging}
      onClick={onSelect}
    >
      <DragHandle>
        <FiMove />
      </DragHandle>

      <QuestionHeader>
        <div>
          <QuestionTitle>
            {question.title}
            {question.required && <RequiredBadge>Required</RequiredBadge>}
          </QuestionTitle>
          <QuestionType>{question.type}</QuestionType>
        </div>
      </QuestionHeader>

      {question.description && (
        <QuestionPreview>{question.description}</QuestionPreview>
      )}

      <div style={{ marginBottom: '1rem' }}>
        {renderPreview()}
      </div>

      <ActionButtons>
        <ActionButton onClick={handleDuplicate}>
          <FiCopy />
          Duplicate
        </ActionButton>
        <ActionButton onClick={handleDelete} variant="danger">
          <FiTrash2 />
          Delete
        </ActionButton>
      </ActionButtons>
    </Item>
  );
};

export default QuestionItem;
