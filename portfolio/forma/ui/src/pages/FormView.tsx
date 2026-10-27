import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { formAPI, responseAPI } from '../services/api';
import { Form, Answer } from '../types';
import FormRenderer from '../components/FormRenderer';

const FormViewContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
`;

const FormHeader = styled.div`
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
`;

const FormTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const FormDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.5;
`;

const FormContent = styled.div`
  padding: 2rem;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
`;

const SuccessTitle = styled.h2`
  font-size: 1.5rem;
  color: #28a745;
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  color: #666;
  font-size: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #666;
`;

const FormView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      const formData = await formAPI.getById(id!);
      setForm(formData);
    } catch (error) {
      console.error('Failed to fetch form:', error);
      setError('Form not found or is not published');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answers: Answer[], userEmail?: string) => {
    if (!form || !id) return;

    try {
      await responseAPI.submit(id, answers, userEmail);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit response:', error);
      setError('Failed to submit response. Please try again.');
    }
  };

  if (loading) {
    return (
      <FormViewContainer>
        <LoadingContainer>Loading...</LoadingContainer>
      </FormViewContainer>
    );
  }

  if (error) {
    return (
      <FormViewContainer>
        <FormCard>
          <FormContent>
            <div style={{ textAlign: 'center', color: '#dc3545' }}>
              <h2>Error</h2>
              <p>{error}</p>
            </div>
          </FormContent>
        </FormCard>
      </FormViewContainer>
    );
  }

  if (!form) {
    return (
      <FormViewContainer>
        <FormCard>
          <FormContent>
            <div style={{ textAlign: 'center' }}>
              <h2>Form not found</h2>
            </div>
          </FormContent>
        </FormCard>
      </FormViewContainer>
    );
  }

  if (submitted) {
    return (
      <FormViewContainer>
        <FormCard>
          <SuccessMessage>
            <SuccessTitle>Thank you!</SuccessTitle>
            <SuccessText>
              Your response has been submitted successfully.
            </SuccessText>
          </SuccessMessage>
        </FormCard>
      </FormViewContainer>
    );
  }

  return (
    <FormViewContainer>
      <FormCard>
        <FormHeader>
          <FormTitle>{form.title}</FormTitle>
          {form.description && (
            <FormDescription>{form.description}</FormDescription>
          )}
        </FormHeader>

        <FormContent>
          <FormRenderer
            form={form}
            onSubmit={handleSubmit}
          />
        </FormContent>
      </FormCard>
    </FormViewContainer>
  );
};

export default FormView;
