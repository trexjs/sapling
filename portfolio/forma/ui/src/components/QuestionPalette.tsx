import React from 'react';
import styled from 'styled-components';
import { 
  FiType, 
  FiAlignLeft, 
  FiMail, 
  FiHash, 
  FiList, 
  FiCircle, 
  FiCheckSquare, 
  FiStar, 
  FiCalendar 
} from 'react-icons/fi';
import { Question } from '../types';

const Palette = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const QuestionTypes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const QuestionType = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: #666;

  &:hover {
    border-color: #007bff;
    background: #f8f9fa;
    color: #007bff;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

interface QuestionPaletteProps {
  onAddQuestion: (type: Question['type']) => void;
}

const questionTypes = [
  { type: 'text' as const, label: 'Short Text', icon: FiType },
  { type: 'textarea' as const, label: 'Long Text', icon: FiAlignLeft },
  { type: 'email' as const, label: 'Email', icon: FiMail },
  { type: 'number' as const, label: 'Number', icon: FiHash },
  { type: 'select' as const, label: 'Dropdown', icon: FiList },
  { type: 'radio' as const, label: 'Multiple Choice', icon: FiCircle },
  { type: 'checkbox' as const, label: 'Checkboxes', icon: FiCheckSquare },
  { type: 'rating' as const, label: 'Rating', icon: FiStar },
  { type: 'date' as const, label: 'Date', icon: FiCalendar },
];

const QuestionPalette: React.FC<QuestionPaletteProps> = ({ onAddQuestion }) => {
  return (
    <Palette>
      <Title>Question Types</Title>
      <QuestionTypes>
        {questionTypes.map(({ type, label, icon: Icon }) => (
          <QuestionType
            key={type}
            onClick={() => onAddQuestion(type)}
          >
            <IconWrapper>
              <Icon />
            </IconWrapper>
            {label}
          </QuestionType>
        ))}
      </QuestionTypes>
    </Palette>
  );
};

export default QuestionPalette;
