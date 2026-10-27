import React, { useState } from 'react';
import styled from 'styled-components';
import { FiChevronDown, FiChevronRight, FiCalendar, FiMail } from 'react-icons/fi';
import { Form, Response } from '../types';

const ListContainer = styled.div`
  padding: 1.5rem;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
`;

const ListTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const ResponseCount = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const ResponseItem = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const ResponseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #e9ecef;
  }
`;

const ResponseInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ResponseNumber = styled.span`
  font-weight: 600;
  color: #1a1a1a;
`;

const ResponseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  color: #666;
  transition: transform 0.2s ease;
`;

const ResponseContent = styled.div<{ expanded: boolean }>`
  max-height: ${props => props.expanded ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const AnswerList = styled.div`
  padding: 1rem;
  background: white;
`;

const AnswerItem = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f8f9fa;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const AnswerQuestion = styled.div`
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const AnswerValue = styled.div`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
`;

const EmptyTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
`;

interface ResponseListProps {
  form: Form;
  responses: Response[];
}

const ResponseList: React.FC<ResponseListProps> = ({ form, responses }) => {
  const [expandedResponses, setExpandedResponses] = useState<Set<string>>(new Set());

  const toggleExpanded = (responseId: string) => {
    const newExpanded = new Set(expandedResponses);
    if (newExpanded.has(responseId)) {
      newExpanded.delete(responseId);
    } else {
      newExpanded.add(responseId);
    }
    setExpandedResponses(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAnswerValue = (response: Response, questionId: string) => {
    const answer = response.answers.find(a => a.questionId === questionId);
    if (!answer) return 'No answer';
    
    if (Array.isArray(answer.value)) {
      return answer.value.join(', ');
    }
    
    return String(answer.value);
  };

  if (responses.length === 0) {
    return (
      <ListContainer>
        <EmptyState>
          <EmptyTitle>No responses yet</EmptyTitle>
          <EmptyText>
            Share your form to start collecting responses
          </EmptyText>
        </EmptyState>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <ListHeader>
        <ListTitle>Responses</ListTitle>
        <ResponseCount>{responses.length} response{responses.length !== 1 ? 's' : ''}</ResponseCount>
      </ListHeader>

      {responses.map((response, index) => {
        const isExpanded = expandedResponses.has(response._id);
        
        return (
          <ResponseItem key={response._id}>
            <ResponseHeader onClick={() => toggleExpanded(response._id)}>
              <ResponseInfo>
                <ResponseNumber>Response #{index + 1}</ResponseNumber>
                <ResponseMeta>
                  <MetaItem>
                    <FiCalendar />
                    {formatDate(response.submittedAt)}
                  </MetaItem>
                  {response.userEmail && (
                    <MetaItem>
                      <FiMail />
                      {response.userEmail}
                    </MetaItem>
                  )}
                </ResponseMeta>
              </ResponseInfo>
              <ExpandButton>
                {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
              </ExpandButton>
            </ResponseHeader>

            <ResponseContent expanded={isExpanded}>
              <AnswerList>
                {form.questions.map(question => (
                  <AnswerItem key={question.id}>
                    <AnswerQuestion>{question.title}</AnswerQuestion>
                    <AnswerValue>
                      {getAnswerValue(response, question.id)}
                    </AnswerValue>
                  </AnswerItem>
                ))}
              </AnswerList>
            </ResponseContent>
          </ResponseItem>
        );
      })}
    </ListContainer>
  );
};

export default ResponseList;
