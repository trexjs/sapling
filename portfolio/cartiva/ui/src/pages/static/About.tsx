import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle } from '../../styles/App.styles';

const AboutContainer = styled.div`
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

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const ValueCard = styled.div`
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ValueIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ValueTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const ValueDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const About: React.FC = () => {
  return (
    <AboutContainer>
      <ContentContainer>
        <HeroSection>
          <HeroTitle>About RARE</HeroTitle>
          <HeroSubtitle>
            We believe in creating exceptional fashion that empowers individuals to express their unique style.
          </HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <ContentTitle>Our Story</ContentTitle>
          <ContentText>
            Founded in 2020, RARE Clothing emerged from a simple yet powerful vision: to create premium fashion 
            that celebrates individuality and self-expression. We started as a small team of passionate designers 
            and fashion enthusiasts who believed that clothing should be more than just fabric—it should be a 
            statement of who you are.
          </ContentText>
          <ContentText>
            Today, we've grown into a global brand that serves men, women, and children with carefully curated 
            collections that blend contemporary trends with timeless elegance. Our commitment to quality, 
            sustainability, and customer satisfaction has made us a trusted name in the fashion industry.
          </ContentText>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Our Mission</ContentTitle>
          <ContentText>
            To democratize premium fashion by making high-quality, stylish clothing accessible to everyone. 
            We believe that everyone deserves to look and feel their best, regardless of their budget or background.
          </ContentText>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Our Values</ContentTitle>
          <ValuesGrid>
            <ValueCard>
              <ValueIcon>🎨</ValueIcon>
              <ValueTitle>Creativity</ValueTitle>
              <ValueDescription>
                We embrace bold designs and innovative approaches to fashion, encouraging our customers to express their unique style.
              </ValueDescription>
            </ValueCard>
            <ValueCard>
              <ValueIcon>🌱</ValueIcon>
              <ValueTitle>Sustainability</ValueTitle>
              <ValueDescription>
                We're committed to ethical production practices and sustainable materials that protect our planet for future generations.
              </ValueDescription>
            </ValueCard>
            <ValueCard>
              <ValueIcon>🤝</ValueIcon>
              <ValueTitle>Community</ValueTitle>
              <ValueDescription>
                We believe in treating everyone with respect and dignity, from our employees to our customers and partners.
              </ValueDescription>
            </ValueCard>
            <ValueCard>
              <ValueIcon>⭐</ValueIcon>
              <ValueTitle>Quality</ValueTitle>
              <ValueDescription>
                Every piece we create meets our high standards for craftsmanship, durability, and style.
              </ValueDescription>
            </ValueCard>
          </ValuesGrid>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Our Team</ContentTitle>
          <ContentText>
            Our diverse team of designers, stylists, and fashion experts work together to bring you the latest 
            trends and timeless classics. We're united by our passion for fashion and our commitment to creating 
            clothing that makes you feel confident and beautiful.
          </ContentText>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Looking Forward</ContentTitle>
          <ContentText>
            As we continue to grow, we remain committed to our founding principles while embracing new technologies 
            and sustainable practices. We're excited about the future of fashion and look forward to continuing 
            to serve our amazing community of customers worldwide.
          </ContentText>
        </ContentSection>
      </ContentContainer>
    </AboutContainer>
  );
};

export default About;
