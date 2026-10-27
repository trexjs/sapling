import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled from 'styled-components';
import { Question } from '../types';

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: #007bff;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const QuestionHeader = styled.div`
  margin-bottom: 1rem;
`;

const QuestionNumber = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const QuestionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0.5rem 0;
`;

const QuestionDescription = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
`;

const RequiredIndicator = styled.span`
  color: #dc3545;
  margin-left: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    background: #f8f9fa;
  }
`;

const OptionInput = styled.input`
  margin: 0;
`;

const OptionText = styled.span`
  font-size: 1rem;
  color: #333;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const StarButton = styled.button<{ filled: boolean }>`
  background: none;
  border: none;
  font-size: 2rem;
  color: ${props => props.filled ? '#ffc107' : '#e9ecef'};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #ffc107;
  }
`;

interface QuestionRendererProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  showProgressBar: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  questionNumber,
  totalQuestions,
  showProgressBar,
}) => {
  const { register, watch, setValue } = useFormContext();
  const watchedValue = watch(question.id);

  const progress = (questionNumber / totalQuestions) * 100;

  const renderInput = () => {
    const commonProps = {
      ...register(question.id, { required: question.required }),
      placeholder: question.placeholder,
    };

    switch (question.type) {
      case 'text':
      case 'email':
        return <Input type={question.type} {...commonProps} />;
      
      case 'textarea':
        return <Textarea {...commonProps} />;
      
      case 'number':
        return (
          <Input
            type="number"
            {...commonProps}
            min={question.min}
            max={question.max}
            step={question.step}
          />
        );
      
      case 'select':
        return (
          <Select {...commonProps}>
            <option value="">Choose an option</option>
            {question.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );
      
      case 'radio':
        return (
          <RadioGroup>
            {question.options?.map((option, index) => (
              <OptionLabel key={index}>
                <OptionInput
                  type="radio"
                  value={option}
                  {...register(question.id, { required: question.required })}
                />
                <OptionText>{option}</OptionText>
              </OptionLabel>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        return (
          <CheckboxGroup>
            {question.options?.map((option, index) => (
              <OptionLabel key={index}>
                <OptionInput
                  type="checkbox"
                  value={option}
                  {...register(`${question.id}.${index}`, { required: question.required })}
                />
                <OptionText>{option}</OptionText>
              </OptionLabel>
            ))}
          </CheckboxGroup>
        );
      
      case 'rating':
        const maxRating = question.max || 5;
        return (
          <RatingContainer>
            {Array.from({ length: maxRating }, (_, index) => {
              const rating = index + 1;
              return (
                <StarButton
                  key={index}
                  type="button"
                  filled={rating <= (watchedValue || 0)}
                  onClick={() => setValue(question.id, rating)}
                >
                  ★
                </StarButton>
              );
            })}
          </RatingContainer>
        );
      
      case 'date':
        return <Input type="date" {...commonProps} />;
      
      default:
        return <Input type="text" {...commonProps} />;
    }
  };

  return (
    <QuestionContainer>
      {showProgressBar && (
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      )}

      <QuestionHeader>
        <QuestionNumber>
          Question {questionNumber} of {totalQuestions}
        </QuestionNumber>
        <QuestionTitle>
          {question.title}
          {question.required && <RequiredIndicator>*</RequiredIndicator>}
        </QuestionTitle>
        {question.description && (
          <QuestionDescription>{question.description}</QuestionDescription>
        )}
      </QuestionHeader>

      {renderInput()}
    </QuestionContainer>
  );
};

export default QuestionRenderer;
