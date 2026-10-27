import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { formAPI } from '../services/api';
import { Form, Question } from '../types';
import FormHeader from '../components/FormHeader';
import QuestionList from '../components/QuestionList';
import QuestionEditor from '../components/QuestionEditor';
import QuestionPalette from '../components/QuestionPalette';
import { v4 as uuidv4 } from 'uuid';

const BuilderContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Sidebar = styled.div`
  width: 300px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 1rem;
  overflow-y: auto;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FormPreview = styled.div`
  flex: 1;
  background: white;
  margin: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const FormBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

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
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = async (updates: Partial<Form>) => {
    if (!form) return;

    try {
      const updatedForm = await formAPI.update(form._id, { ...form, ...updates });
      setForm(updatedForm);
    } catch (error) {
      console.error('Failed to update form:', error);
    }
  };

  const addQuestion = (type: Question['type']) => {
    if (!form) return;

    const newQuestion: Question = {
      id: uuidv4(),
      type,
      title: 'Untitled Question',
      description: '',
      required: false,
      options: type === 'select' || type === 'radio' || type === 'checkbox' ? ['Option 1'] : undefined,
    };

    const updatedQuestions = [...form.questions, newQuestion];
    updateForm({ questions: updatedQuestions });
    setSelectedQuestion(newQuestion);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    if (!form) return;

    const updatedQuestions = form.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );
    updateForm({ questions: updatedQuestions });

    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion({ ...selectedQuestion, ...updates });
    }
  };

  const deleteQuestion = (questionId: string) => {
    if (!form) return;

    const updatedQuestions = form.questions.filter(q => q.id !== questionId);
    updateForm({ questions: updatedQuestions });

    if (selectedQuestion?.id === questionId) {
      setSelectedQuestion(null);
    }
  };

  const duplicateQuestion = (questionId: string) => {
    if (!form) return;

    const questionToDuplicate = form.questions.find(q => q.id === questionId);
    if (!questionToDuplicate) return;

    const duplicatedQuestion: Question = {
      ...questionToDuplicate,
      id: uuidv4(),
      title: `${questionToDuplicate.title} (Copy)`,
    };

    const questionIndex = form.questions.findIndex(q => q.id === questionId);
    const updatedQuestions = [
      ...form.questions.slice(0, questionIndex + 1),
      duplicatedQuestion,
      ...form.questions.slice(questionIndex + 1),
    ];

    updateForm({ questions: updatedQuestions });
  };

  const moveQuestion = (dragIndex: number, hoverIndex: number) => {
    if (!form) return;

    const draggedQuestion = form.questions[dragIndex];
    const updatedQuestions = [...form.questions];
    updatedQuestions.splice(dragIndex, 1);
    updatedQuestions.splice(hoverIndex, 0, draggedQuestion);

    updateForm({ questions: updatedQuestions });
  };

  const handlePublish = async () => {
    if (!form) return;

    try {
      await formAPI.publish(form._id, !form.settings.isPublished);
      fetchForm(); // Refresh form data
    } catch (error) {
      console.error('Failed to publish form:', error);
    }
  };

  if (loading) {
    return (
      <BuilderContainer>
        <div>Loading...</div>
      </BuilderContainer>
    );
  }

  if (!form) {
    return (
      <BuilderContainer>
        <div>Form not found</div>
      </BuilderContainer>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <BuilderContainer>
        <Sidebar>
          <QuestionPalette onAddQuestion={addQuestion} />
        </Sidebar>

        <MainContent>
          <FormHeader
            form={form}
            onUpdate={updateForm}
            onPublish={handlePublish}
          />

          <FormPreview>
            <QuestionList
              questions={form.questions}
              selectedQuestion={selectedQuestion}
              onSelectQuestion={setSelectedQuestion}
              onUpdateQuestion={updateQuestion}
              onDeleteQuestion={deleteQuestion}
              onDuplicateQuestion={duplicateQuestion}
              onMoveQuestion={moveQuestion}
            />
          </FormPreview>

          {selectedQuestion && (
            <QuestionEditor
              question={selectedQuestion}
              onUpdate={(updates) => updateQuestion(selectedQuestion.id, updates)}
              onClose={() => setSelectedQuestion(null)}
            />
          )}
        </MainContent>
      </BuilderContainer>
    </DndProvider>
  );
};

export default FormBuilder;
