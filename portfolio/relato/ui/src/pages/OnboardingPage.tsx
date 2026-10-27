import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Card, CardHeader, CardTitle, PrimaryButton } from '../components/styled/CommonComponents';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #6b7280;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const OnboardingCard = styled(Card)`
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: #3b82f6;
  }
`;

const IconContainer = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardTitleText = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const onboardingOptions = [
    {
      id: 'school',
      title: 'Add School',
      description: 'Create a new school profile with all necessary details including contact information, address, facilities, and courses offered.',
      icon: '🏫',
      route: '/schools/create',
      color: '#3b82f6'
    },
    {
      id: 'teacher',
      title: 'Add Teacher',
      description: 'Onboard a new teacher with their profile information, expertise, experience, and required documents.',
      icon: '👨‍🏫',
      route: '/teachers/create',
      color: '#10b981'
    },
    {
      id: 'student',
      title: 'Add Student',
      description: 'Register a new student with their personal details, guardian information, and admission records.',
      icon: '👨‍🎓',
      route: '/students/create',
      color: '#f59e0b'
    }
  ];

  return (
    <PageContainer>
      <Header>
        <Title>Onboarding Center</Title>
        <Subtitle>Choose what you'd like to add to the system</Subtitle>
      </Header>

      <CardsGrid>
        {onboardingOptions.map((option) => (
          <OnboardingCard key={option.id} onClick={() => navigate(option.route)}>
            <CardContent>
              <IconContainer>
                {option.icon}
              </IconContainer>
              <CardTitleText>{option.title}</CardTitleText>
              <CardDescription>{option.description}</CardDescription>
              <ButtonContainer>
                <PrimaryButton onClick={(e) => {
                  e.stopPropagation();
                  navigate(option.route);
                }}>
                  Get Started →
                </PrimaryButton>
              </ButtonContainer>
            </CardContent>
          </OnboardingCard>
        ))}
      </CardsGrid>
    </PageContainer>
  );
};

export default OnboardingPage;
