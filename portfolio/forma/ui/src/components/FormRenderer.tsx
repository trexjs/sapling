import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import styled from 'styled-components';
import { Form, Answer } from '../types';
import QuestionRenderer from './QuestionRenderer';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmailField = styled.div`
  margin-bottom: 2rem;
`;

const EmailLabel = styled.label`
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const EmailInput = styled.input`
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

interface FormRendererProps {
  form: Form;
  onSubmit: (answers: Answer[], userEmail?: string) => void;
}

const FormRenderer: React.FC<FormRendererProps> = ({ form, onSubmit }) => {
  const [userEmail, setUserEmail] = useState('');
  const methods = useForm();

  const onFormSubmit = (data: any) => {
    const answers: Answer[] = form.questions.map(question => {
      const value = data[question.id];
      return {
        questionId: question.id,
        value: value || '',
      };
    });

    onSubmit(answers, form.settings.collectEmail ? userEmail : undefined);
  };

  return (
    <FormProvider {...methods}>
      <FormContainer onSubmit={methods.handleSubmit(onFormSubmit)}>
        {form.settings.collectEmail && (
          <EmailField>
            <EmailLabel>Email Address (Optional)</EmailLabel>
            <EmailInput
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email address"
            />
          </EmailField>
        )}

        {form.questions.map((question, index) => (
          <QuestionRenderer
            key={question.id}
            question={question}
            questionNumber={index + 1}
            totalQuestions={form.questions.length}
            showProgressBar={form.settings.showProgressBar}
          />
        ))}

        <SubmitButton type="submit" disabled={methods.formState.isSubmitting}>
          {methods.formState.isSubmitting ? 'Submitting...' : 'Submit'}
        </SubmitButton>
      </FormContainer>
    </FormProvider>
  );
};

export default FormRenderer;
