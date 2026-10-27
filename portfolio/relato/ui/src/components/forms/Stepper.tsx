import React from 'react';
import styled from 'styled-components';

const StepperContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const StepContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease-in-out;

  ${props => {
    if (props.completed) {
      return `
        background-color: #10b981;
        color: white;
        border: 2px solid #10b981;
      `;
    } else if (props.active) {
      return `
        background-color: #3b82f6;
        color: white;
        border: 2px solid #3b82f6;
      `;
    } else {
      return `
        background-color: white;
        color: #9ca3af;
        border: 2px solid #e5e7eb;
      `;
    }
  }}
`;

const StepLabel = styled.div<{ active: boolean; completed: boolean }>`
  position: absolute;
  top: 50px;
  transform: translateX(-50%);
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  color: ${props => props.active || props.completed ? '#374151' : '#9ca3af'};
`;

const StepConnector = styled.div<{ completed: boolean }>`
  width: 100px;
  height: 2px;
  background-color: ${props => props.completed ? '#10b981' : '#e5e7eb'};
  margin: 0 1rem;
  transition: background-color 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 60px;
    margin: 0 0.5rem;
  }
`;

const CheckIcon = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

export interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <StepperContainer>
      <StepContainer>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Step
                active={index === currentStep}
                completed={index < currentStep}
                onClick={() => onStepClick?.(index)}
                style={{ cursor: onStepClick ? 'pointer' : 'default' }}
              >
                {index < currentStep ? <CheckIcon /> : index + 1}
              </Step>
              <StepLabel
                active={index === currentStep}
                completed={index < currentStep}
              >
                {step.title}
              </StepLabel>
            </div>
            {index < steps.length - 1 && (
              <StepConnector completed={index < currentStep} />
            )}
          </React.Fragment>
        ))}
      </StepContainer>
    </StepperContainer>
  );
};

export default Stepper;
