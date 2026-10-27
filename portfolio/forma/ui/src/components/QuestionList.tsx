import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { Question } from '../types';
import QuestionItem from './QuestionItem';

const List = styled.div<{ isOver: boolean }>`
  padding: 2rem;
  min-height: 400px;
  background-color: ${props => props.isOver ? '#f0f8ff' : 'white'};
  transition: background-color 0.2s ease;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const EmptyStateText = styled.p`
  font-size: 0.9rem;
`;

interface QuestionListProps {
  questions: Question[];
  selectedQuestion: Question | null;
  onSelectQuestion: (question: Question) => void;
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (questionId: string) => void;
  onDuplicateQuestion: (questionId: string) => void;
  onMoveQuestion: (dragIndex: number, hoverIndex: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  selectedQuestion,
  onSelectQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onDuplicateQuestion,
  onMoveQuestion,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'question',
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  if (questions.length === 0) {
    return (
      <List ref={drop} isOver={isOver}>
        <EmptyState>
          <EmptyStateTitle>No questions yet</EmptyStateTitle>
          <EmptyStateText>
            Add questions from the sidebar to start building your form
          </EmptyStateText>
        </EmptyState>
      </List>
    );
  }

  return (
    <List ref={drop} isOver={isOver}>
      {questions.map((question, index) => (
        <QuestionItem
          key={question.id}
          question={question}
          index={index}
          isSelected={selectedQuestion?.id === question.id}
          onSelect={() => onSelectQuestion(question)}
          onUpdate={(updates) => onUpdateQuestion(question.id, updates)}
          onDelete={() => onDeleteQuestion(question.id)}
          onDuplicate={() => onDuplicateQuestion(question.id)}
          onMove={onMoveQuestion}
        />
      ))}
    </List>
  );
};

export default QuestionList;
