import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { formAPI } from "../services/api";
import { Form } from "../types";
import FormCard from "../components/FormCard";
import CreateFormButton from "../components/CreateFormButton";

const DashboardContainer = styled.div`
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

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const FormsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const Dashboard: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const formsData = await formAPI.getAll();
      setForms(formsData);
    } catch (error) {
      console.error("Failed to fetch forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateForm = async () => {
    try {
      const newForm = await formAPI.create({
        title: "Untitled Form",
        description: "",
        questions: [],
        settings: {
          isPublished: false,
          allowMultipleResponses: true,
          collectEmail: false,
          showProgressBar: true,
        },
      });
      navigate(`/form/${newForm._id}`);
    } catch (error) {
      console.error("Failed to create form:", error);
    }
  };

  const handleDeleteForm = async (formId: string) => {
    try {
      await formAPI.delete(formId);
      setForms(forms.filter((form) => form._id !== formId));
    } catch (error) {
      console.error("Failed to delete form:", error);
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <div>Loading...</div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>My Forms</Title>
        <CreateFormButton onClick={handleCreateForm} />
      </Header>

      {forms.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No forms yet</EmptyStateTitle>
          <EmptyStateText>
            Create your first form to start collecting responses
          </EmptyStateText>
          <CreateFormButton onClick={handleCreateForm} />
        </EmptyState>
      ) : (
        <FormsGrid>
          {forms?.map((form) => (
            <FormCard
              key={form._id}
              form={form}
              onDelete={() => handleDeleteForm(form._id)}
            />
          ))}
        </FormsGrid>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
