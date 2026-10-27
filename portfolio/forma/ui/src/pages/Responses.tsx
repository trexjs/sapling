import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiDownload, FiBarChart, FiUsers } from 'react-icons/fi';
import { formAPI, responseAPI } from '../services/api';
import { Form, Response, ResponseStats } from '../types';
import ResponseList from '../components/ResponseList';
import ResponseStatsComponent from '../components/ResponseStatsComponent';

const ResponsesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background: #e9ecef;
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
  margin-left: 1rem;
`;

const FormTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
`;

const FormDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const MainContent = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #666;
`;

const Responses: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [stats, setStats] = useState<ResponseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const [formData, responsesData, statsData] = await Promise.all([
        formAPI.getById(id!),
        responseAPI.getByFormId(id!),
        responseAPI.getStats(id!),
      ]);
      
      setForm(formData);
      setResponses(responsesData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!form || !responses.length) return;

    const csvData = responses.map((response, index) => {
      const row: any = { 'Response #': index + 1, 'Submitted At': response.submittedAt };
      
      if (response.userEmail) {
        row['Email'] = response.userEmail;
      }

      form.questions.forEach(question => {
        const answer = response.answers.find(a => a.questionId === question.id);
        row[question.title] = answer ? answer.value : '';
      });

      return row;
    });

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_responses.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <ResponsesContainer>
        <LoadingContainer>Loading...</LoadingContainer>
      </ResponsesContainer>
    );
  }

  if (!form) {
    return (
      <ResponsesContainer>
        <div>Form not found</div>
      </ResponsesContainer>
    );
  }

  return (
    <ResponsesContainer>
      <Header>
        <BackButton onClick={() => navigate(`/form/${id}`)}>
          <FiArrowLeft />
          Back to Form
        </BackButton>

        <HeaderInfo>
          <FormTitle>{form.title}</FormTitle>
          {form.description && (
            <FormDescription>{form.description}</FormDescription>
          )}
        </HeaderInfo>

        <ActionButtons>
          <Button onClick={handleExport}>
            <FiDownload />
            Export CSV
          </Button>
        </ActionButtons>
      </Header>

      <Content>
        <Sidebar>
          <ResponseStatsComponent stats={stats} />
        </Sidebar>

        <MainContent>
          <ResponseList
            form={form}
            responses={responses}
          />
        </MainContent>
      </Content>
    </ResponsesContainer>
  );
};

export default Responses;
