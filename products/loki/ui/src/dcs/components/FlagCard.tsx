import React from 'react';
import styled from 'styled-components';
import { DCSFlag } from '../types';

const Card = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const FlagName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.125rem;
`;

const StatusBadge = styled.span<{ active: boolean }>`
  background: ${props => props.active ? '#28a745' : '#dc3545'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const TypeBadge = styled.span<{ type: string }>`
  background: ${props => props.type === 'EXP' ? '#ffc107' : '#6c757d'};
  color: ${props => props.type === 'EXP' ? '#000' : '#fff'};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const Details = styled.div`
  margin-bottom: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Label = styled.span`
  color: #666;
  font-weight: 500;
`;

const Value = styled.span`
  color: #333;
`;

const AccountsList = styled.div`
  margin-bottom: 1rem;
`;

const AccountTag = styled.span`
  background: #e9ecef;
  color: #495057;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
  display: inline-block;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background: #007bff;
    color: white;
    
    &:hover {
      background: #0056b3;
    }
  ` : `
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  `}
`;

const POCInfo = styled.div`
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const POCName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
`;

const POCDetails = styled.div`
  font-size: 0.75rem;
  color: #666;
`;

interface FlagCardProps {
  flag: DCSFlag;
  onEdit: () => void;
  onMap: () => void;
}

export const FlagCard: React.FC<FlagCardProps> = ({ flag, onEdit, onMap }) => {
  return (
    <Card>
      <Header>
        <FlagName>{flag.name}</FlagName>
        <div>
          <StatusBadge active={flag.status}>
            {flag.status ? 'Active' : 'Inactive'}
          </StatusBadge>
          <TypeBadge type={flag.type}>
            {flag.type}
          </TypeBadge>
        </div>
      </Header>

      <Details>
        <DetailRow>
          <Label>Expiry:</Label>
          <Value>{flag.exp}</Value>
        </DetailRow>
        <DetailRow>
          <Label>Created by:</Label>
          <Value>{flag.created_by}</Value>
        </DetailRow>
        <DetailRow>
          <Label>Updated by:</Label>
          <Value>{flag.updated_by}</Value>
        </DetailRow>
      </Details>

      {flag.poc && (flag.poc.name || flag.poc.escalation_mail || flag.poc.oncall_id) && (
        <POCInfo>
          <POCName>POC: {flag.poc.name || 'Not specified'}</POCName>
          <POCDetails>
            {flag.poc.escalation_mail && <div>Email: {flag.poc.escalation_mail}</div>}
            {flag.poc.oncall_id && <div>On-call ID: {flag.poc.oncall_id}</div>}
          </POCDetails>
        </POCInfo>
      )}

      {flag.associated_accounts.length > 0 && (
        <AccountsList>
          <Label>Associated Accounts:</Label>
          <div style={{ marginTop: '0.5rem' }}>
            {flag.associated_accounts.map((account, index) => (
              <AccountTag key={index}>{account}</AccountTag>
            ))}
          </div>
        </AccountsList>
      )}

      <Actions>
        <Button variant="primary" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="secondary" onClick={onMap}>
          Map Accounts
        </Button>
      </Actions>
    </Card>
  );
};
