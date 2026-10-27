import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, Button } from '../../styles/App.styles';

const ReturnsContainer = styled.div`
  padding-top: 100px;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #666;
  line-height: 1.6;
`;

const ContentSection = styled.div`
  margin-bottom: 3rem;
`;

const ContentTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const ContentText = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const PolicyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const PolicyCard = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const PolicyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const PolicyTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const PolicyDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const StepCard = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  position: relative;
  
  &::after {
    content: '→';
    position: absolute;
    right: -1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    color: #1a1a1a;
    
    @media (max-width: 768px) {
      display: none;
    }
  }
  
  &:last-child::after {
    display: none;
  }
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  background: #1a1a1a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin: 0 auto 1rem;
`;

const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
`;

const StepDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
  font-size: 0.875rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const InfoCard = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.75rem;
  }
  
  p {
    color: #666;
    line-height: 1.6;
    margin: 0;
  }
`;

const Returns: React.FC = () => {
  return (
    <ReturnsContainer>
      <ContentContainer>
        <HeroSection>
          <HeroTitle>Returns & Exchanges</HeroTitle>
          <HeroSubtitle>
            We want you to love your RARE items. If you're not completely satisfied, we're here to help.
          </HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <ContentTitle>Our Return Policy</ContentTitle>
          <ContentText>
            We offer a 30-day return policy on all items in original condition with tags attached. 
            Returns are free and easy - we'll even provide a prepaid return label.
          </ContentText>
          
          <PolicyGrid>
            <PolicyCard>
              <PolicyIcon>📅</PolicyIcon>
              <PolicyTitle>30-Day Returns</PolicyTitle>
              <PolicyDescription>
                Return any item within 30 days of delivery for a full refund
              </PolicyDescription>
            </PolicyCard>
            
            <PolicyCard>
              <PolicyIcon>🆓</PolicyIcon>
              <PolicyTitle>Free Returns</PolicyTitle>
              <PolicyDescription>
                We cover the cost of return shipping for all domestic returns
              </PolicyDescription>
            </PolicyCard>
            
            <PolicyCard>
              <PolicyIcon>💰</PolicyIcon>
              <PolicyTitle>Full Refund</PolicyTitle>
              <PolicyDescription>
                Receive a full refund to your original payment method
              </PolicyDescription>
            </PolicyCard>
            
            <PolicyCard>
              <PolicyIcon>🔄</PolicyIcon>
              <PolicyTitle>Easy Exchange</PolicyTitle>
              <PolicyDescription>
                Exchange for a different size or color at no extra cost
              </PolicyDescription>
            </PolicyCard>
          </PolicyGrid>
        </ContentSection>

        <ContentSection>
          <ContentTitle>How to Return an Item</ContentTitle>
          <ProcessSteps>
            <StepCard>
              <StepNumber>1</StepNumber>
              <StepTitle>Start Your Return</StepTitle>
              <StepDescription>
                Log into your account and select the items you want to return
              </StepDescription>
            </StepCard>
            
            <StepCard>
              <StepNumber>2</StepNumber>
              <StepTitle>Print Label</StepTitle>
              <StepDescription>
                Print the prepaid return label and packing slip
              </StepDescription>
            </StepCard>
            
            <StepCard>
              <StepNumber>3</StepNumber>
              <StepTitle>Pack & Ship</StepTitle>
              <StepDescription>
                Pack your items securely and drop off at any authorized location
              </StepDescription>
            </StepCard>
            
            <StepCard>
              <StepNumber>4</StepNumber>
              <StepTitle>Get Refund</StepTitle>
              <StepDescription>
                Receive your refund within 5-7 business days after we receive your return
              </StepDescription>
            </StepCard>
          </ProcessSteps>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Return Conditions</ContentTitle>
          <InfoGrid>
            <InfoCard>
              <h3>Original Condition</h3>
              <p>
                Items must be in original condition with all tags attached and no signs of wear.
              </p>
            </InfoCard>
            
            <InfoCard>
              <h3>Original Packaging</h3>
              <p>
                Please return items in their original packaging when possible to ensure safe transit.
              </p>
            </InfoCard>
            
            <InfoCard>
              <h3>Hygiene Items</h3>
              <p>
                For hygiene reasons, underwear, swimwear, and intimate apparel cannot be returned.
              </p>
            </InfoCard>
            
            <InfoCard>
              <h3>Sale Items</h3>
              <p>
                Final sale items are not eligible for return unless defective or incorrect item sent.
              </p>
            </InfoCard>
          </InfoGrid>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Exchange Policy</ContentTitle>
          <ContentText>
            Need a different size or color? We offer free exchanges within 30 days of delivery. 
            Simply select "Exchange" when starting your return, and we'll send you the new item 
            as soon as we receive your return.
          </ContentText>
        </ContentSection>

        <ContentSection>
          <ContentTitle>International Returns</ContentTitle>
          <ContentText>
            International customers are responsible for return shipping costs. We recommend using 
            a trackable shipping method to ensure your return reaches us safely. Refunds will be 
            processed once we receive and inspect your return.
          </ContentText>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Need Help?</ContentTitle>
          <ContentText>
            If you have any questions about returns or need assistance, please contact our customer 
            service team at returns@rareclothing.com or call us at +1 (555) 123-4567. We're here 
            to help make your return experience as smooth as possible.
          </ContentText>
        </ContentSection>
      </ContentContainer>
    </ReturnsContainer>
  );
};

export default Returns;
