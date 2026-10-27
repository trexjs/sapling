import React from 'react';
import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { Question } from '../types';

const Editor = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e9ecef;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
  }
`;

const Content = styled.div`
  padding: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-size: 0.9rem;
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
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #333;
`;

const OptionsList = styled.div`
  margin-top: 0.5rem;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const OptionInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
`;

const AddOptionButton = styled.button`
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #0056b3;
  }
`;

const RemoveOptionButton = styled.button`
  padding: 0.25rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s ease;

  &:hover {
    background: #c82333;
  }
`;

const NumberInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
  onClose: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate,
  onClose,
}) => {
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ title: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ description: e.target.value });
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ required: e.target.checked });
  };

  const handlePlaceholderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ placeholder: e.target.value });
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!question.options) return;
    const newOptions = [...question.options];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...(question.options || []), 'New option'];
    onUpdate({ options: newOptions });
  };

  const handleRemoveOption = (index: number) => {
    if (!question.options) return;
    const newOptions = question.options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ min: parseInt(e.target.value) || undefined });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ max: parseInt(e.target.value) || undefined });
  };

  const handleStepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ step: parseInt(e.target.value) || undefined });
  };

  const needsOptions = ['select', 'radio', 'checkbox'].includes(question.type);
  const needsMinMax = ['number', 'rating'].includes(question.type);

  return (
    <Editor>
      <Header>
        <Title>Question Settings</Title>
        <CloseButton onClick={onClose}>
          <FiX />
        </CloseButton>
      </Header>

      <Content>
        <FormGroup>
          <Label>Question Title</Label>
          <Input
            type="text"
            value={question.title}
            onChange={handleTitleChange}
            placeholder="Enter question title"
          />
        </FormGroup>

        <FormGroup>
          <Label>Description (Optional)</Label>
          <Textarea
            value={question.description || ''}
            onChange={handleDescriptionChange}
            placeholder="Enter question description"
          />
        </FormGroup>

        <FormGroup>
          <Checkbox>
            <input
              type="checkbox"
              checked={question.required}
              onChange={handleRequiredChange}
            />
            Required question
          </Checkbox>
        </FormGroup>

        <FormGroup>
          <Label>Placeholder Text</Label>
          <Input
            type="text"
            value={question.placeholder || ''}
            onChange={handlePlaceholderChange}
            placeholder="Enter placeholder text"
          />
        </FormGroup>

        {needsOptions && (
          <FormGroup>
            <Label>Options</Label>
            <OptionsList>
              {question.options?.map((option, index) => (
                <OptionItem key={index}>
                  <OptionInput
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder="Enter option"
                  />
                  <RemoveOptionButton
                    onClick={() => handleRemoveOption(index)}
                  >
                    ×
                  </RemoveOptionButton>
                </OptionItem>
              ))}
              <AddOptionButton onClick={handleAddOption}>
                Add Option
              </AddOptionButton>
            </OptionsList>
          </FormGroup>
        )}

        {needsMinMax && (
          <FormGroup>
            <Label>Min/Max Values</Label>
            <NumberInputs>
              <div>
                <Label>Minimum</Label>
                <Input
                  type="number"
                  value={question.min || ''}
                  onChange={handleMinChange}
                  placeholder="Min"
                />
              </div>
              <div>
                <Label>Maximum</Label>
                <Input
                  type="number"
                  value={question.max || ''}
                  onChange={handleMaxChange}
                  placeholder="Max"
                />
              </div>
            </NumberInputs>
            {question.type === 'number' && (
              <div style={{ marginTop: '0.5rem' }}>
                <Label>Step</Label>
                <Input
                  type="number"
                  value={question.step || ''}
                  onChange={handleStepChange}
                  placeholder="Step"
                />
              </div>
            )}
          </FormGroup>
        )}
      </Content>
    </Editor>
  );
};

export default QuestionEditor;
