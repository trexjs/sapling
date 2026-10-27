import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Main = styled.main`
  flex: 1;
  padding-top: 80px; /* Account for fixed header */
`;

export const Section = styled.section`
  padding: 60px 0;
  
  @media (max-width: 768px) {
    padding: 40px 0;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem;
  color: #1a1a1a;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline'; size?: 'small' | 'medium' | 'large' }>`
  padding: ${props => {
    switch (props.size) {
      case 'small': return '8px 16px';
      case 'large': return '16px 32px';
      default: return '12px 24px';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '0.875rem';
      case 'large': return '1.125rem';
      default: return '1rem';
    }
  }};
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #1a1a1a;
          color: white;
          &:hover {
            background-color: #333;
          }
        `;
      case 'secondary':
        return `
          background-color: #f5f5f5;
          color: #1a1a1a;
          &:hover {
            background-color: #e5e5e5;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: #1a1a1a;
          border-color: #1a1a1a;
          &:hover {
            background-color: #1a1a1a;
            color: white;
          }
        `;
      default:
        return `
          background-color: #1a1a1a;
          color: white;
          &:hover {
            background-color: #333;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 4}, 1fr);
  gap: ${props => props.gap || '2rem'};
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #1a1a1a;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  margin: 1rem 0;
`;
