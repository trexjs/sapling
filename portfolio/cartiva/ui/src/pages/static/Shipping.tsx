import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle } from '../../styles/App.styles';

const ShippingContainer = styled.div`
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

const ShippingOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const ShippingCard = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const ShippingIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ShippingTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const ShippingPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const ShippingDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background: #f8f9fa;
    font-weight: 600;
    color: #1a1a1a;
  }
  
  td {
    color: #666;
  }
`;

const Shipping: React.FC = () => {
  return (
    <ShippingContainer>
      <ContentContainer>
        <HeroSection>
          <HeroTitle>Shipping Information</HeroTitle>
          <HeroSubtitle>
            Fast, reliable shipping to get your RARE items to you quickly and safely.
          </HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <ContentTitle>Shipping Options</ContentTitle>
          <ContentText>
            We offer multiple shipping options to meet your needs. All orders are processed within 1-2 business days.
          </ContentText>
          
          <ShippingOptions>
            <ShippingCard>
              <ShippingIcon>📦</ShippingIcon>
              <ShippingTitle>Standard Shipping</ShippingTitle>
              <ShippingPrice>FREE</ShippingPrice>
              <ShippingDescription>
                3-5 business days<br />
                Orders over $50
              </ShippingDescription>
            </ShippingCard>
            
            <ShippingCard>
              <ShippingIcon>⚡</ShippingIcon>
              <ShippingTitle>Express Shipping</ShippingTitle>
              <ShippingPrice>$9.99</ShippingPrice>
              <ShippingDescription>
                1-2 business days<br />
                Available for all orders
              </ShippingDescription>
            </ShippingCard>
            
            <ShippingCard>
              <ShippingIcon>🚀</ShippingIcon>
              <ShippingTitle>Overnight Shipping</ShippingTitle>
              <ShippingPrice>$19.99</ShippingPrice>
              <ShippingDescription>
                Next business day<br />
                Order by 2 PM EST
              </ShippingDescription>
            </ShippingCard>
          </ShippingOptions>
        </ContentSection>

        <ContentSection>
          <ContentTitle>International Shipping</ContentTitle>
          <ContentText>
            We ship to over 50 countries worldwide. International shipping rates and delivery times vary by destination.
          </ContentText>
          
          <Table>
            <thead>
              <tr>
                <th>Region</th>
                <th>Delivery Time</th>
                <th>Shipping Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Canada</td>
                <td>5-7 business days</td>
                <td>$12.99</td>
              </tr>
              <tr>
                <td>Europe</td>
                <td>7-10 business days</td>
                <td>$15.99</td>
              </tr>
              <tr>
                <td>Asia Pacific</td>
                <td>10-14 business days</td>
                <td>$18.99</td>
              </tr>
              <tr>
                <td>Other Countries</td>
                <td>10-21 business days</td>
                <td>$22.99</td>
              </tr>
            </tbody>
          </Table>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Shipping Policies</ContentTitle>
          <InfoGrid>
            <InfoCard>
              <h3>Order Processing</h3>
              <p>
                All orders are processed within 1-2 business days. You'll receive a confirmation email 
                with tracking information once your order ships.
              </p>
            </InfoCard>
            
            <InfoCard>
              <h3>Tracking Your Order</h3>
              <p>
                Track your package in real-time using the tracking number provided in your shipping 
                confirmation email.
              </p>
            </InfoCard>
            
            <InfoCard>
              <h3>Delivery Attempts</h3>
              <p>
                If delivery is attempted and no one is available, packages will be held at your local 
                post office for pickup.
              </p>
            </InfoCard>
            
            <InfoCard>
              <h3>Address Changes</h3>
              <p>
                Address changes can be made within 2 hours of order placement. Contact customer service 
                for assistance.
              </p>
            </InfoCard>
          </InfoGrid>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Shipping Restrictions</ContentTitle>
          <ContentText>
            Some items may have shipping restrictions due to size, weight, or destination regulations. 
            We'll notify you if any items in your order cannot be shipped to your location.
          </ContentText>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Need Help?</ContentTitle>
          <ContentText>
            If you have any questions about shipping or need assistance with your order, please contact 
            our customer service team at shipping@rareclothing.com or call us at +1 (555) 123-4567.
          </ContentText>
        </ContentSection>
      </ContentContainer>
    </ShippingContainer>
  );
};

export default Shipping;
