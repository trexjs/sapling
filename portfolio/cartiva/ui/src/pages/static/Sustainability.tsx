import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, Button } from '../../styles/App.styles';

const SustainabilityContainer = styled.div`
  padding-top: 100px;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  max-width: 1000px;
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

const ImpactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const ImpactCard = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const ImpactIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ImpactNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const ImpactTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
`;

const ImpactDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const PracticesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const PracticeCard = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1a1a1a;
`;

const PracticeTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const PracticeDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const TimelineSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 8px;
  margin: 4rem 0;
`;

const TimelineTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;

const TimelineGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const TimelineItem = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    opacity: 0.9;
    margin: 0;
    font-size: 0.875rem;
  }
`;

const CommitmentSection = styled.div`
  background: #f8f9fa;
  padding: 3rem 2rem;
  border-radius: 8px;
  text-align: center;
  margin: 4rem 0;
`;

const CommitmentTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const CommitmentText = styled.p`
  color: #666;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Sustainability: React.FC = () => {
  return (
    <SustainabilityContainer>
      <ContentContainer>
        <HeroSection>
          <HeroTitle>Our Sustainability Commitment</HeroTitle>
          <HeroSubtitle>
            We believe fashion should be beautiful, ethical, and sustainable. Our commitment to 
            environmental responsibility guides every decision we make.
          </HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <ContentTitle>Our Impact</ContentTitle>
          <ContentText>
            Since our founding, we've been committed to reducing our environmental footprint 
            and creating positive change in the fashion industry.
          </ContentText>
          
          <ImpactGrid>
            <ImpactCard>
              <ImpactIcon>🌱</ImpactIcon>
              <ImpactNumber>85%</ImpactNumber>
              <ImpactTitle>Organic Materials</ImpactTitle>
              <ImpactDescription>
                of our materials are organic, recycled, or sustainably sourced
              </ImpactDescription>
            </ImpactCard>
            
            <ImpactCard>
              <ImpactIcon>💧</ImpactIcon>
              <ImpactNumber>60%</ImpactNumber>
              <ImpactTitle>Water Reduction</ImpactTitle>
              <ImpactDescription>
                less water used in our production processes compared to industry average
              </ImpactDescription>
            </ImpactCard>
            
            <ImpactCard>
              <ImpactIcon>♻️</ImpactIcon>
              <ImpactNumber>95%</ImpactNumber>
              <ImpactTitle>Waste Reduction</ImpactTitle>
              <ImpactDescription>
                of our production waste is recycled or repurposed
              </ImpactDescription>
            </ImpactCard>
            
            <ImpactCard>
              <ImpactIcon>🌍</ImpactIcon>
              <ImpactNumber>100%</ImpactNumber>
              <ImpactTitle>Carbon Neutral</ImpactTitle>
              <ImpactDescription>
                shipping and operations are carbon neutral through verified offsets
              </ImpactDescription>
            </ImpactCard>
          </ImpactGrid>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Sustainable Practices</ContentTitle>
          <ContentText>
            Our sustainability efforts span every aspect of our business, from material sourcing 
            to packaging and shipping.
          </ContentText>
          
          <PracticesGrid>
            <PracticeCard>
              <PracticeTitle>🌿 Sustainable Materials</PracticeTitle>
              <PracticeDescription>
                We use organic cotton, recycled polyester, and innovative materials like Tencel 
                and hemp. All materials are certified by recognized sustainability standards.
              </PracticeDescription>
            </PracticeCard>
            
            <PracticeCard>
              <PracticeTitle>🏭 Ethical Manufacturing</PracticeTitle>
              <PracticeDescription>
                Our manufacturing partners are certified for fair labor practices and safe working 
                conditions. We regularly audit our supply chain to ensure compliance.
              </PracticeDescription>
            </PracticeCard>
            
            <PracticeCard>
              <PracticeTitle>📦 Eco-Friendly Packaging</PracticeTitle>
              <PracticeDescription>
                All packaging is made from recycled materials and is fully recyclable. We've 
                eliminated single-use plastics from our shipping process.
              </PracticeDescription>
            </PracticeCard>
            
            <PracticeCard>
              <PracticeTitle>🚚 Carbon-Neutral Shipping</PracticeTitle>
              <PracticeDescription>
                We offset 100% of our shipping emissions through verified carbon offset programs. 
                We also optimize shipping routes to minimize environmental impact.
              </PracticeDescription>
            </PracticeCard>
            
            <PracticeCard>
              <PracticeTitle>♻️ Circular Fashion</PracticeTitle>
              <PracticeDescription>
                We offer take-back programs for old clothing and work with recycling partners 
                to give garments a second life through upcycling and material recovery.
              </PracticeDescription>
            </PracticeCard>
            
            <PracticeCard>
              <PracticeTitle>💧 Water Conservation</PracticeTitle>
              <PracticeDescription>
                Our production processes use water-efficient techniques and closed-loop systems 
                to minimize water usage and prevent contamination.
              </PracticeDescription>
            </PracticeCard>
          </PracticesGrid>
        </ContentSection>

        <TimelineSection>
          <TimelineTitle>Our Sustainability Journey</TimelineTitle>
          <TimelineGrid>
            <TimelineItem>
              <h3>2020</h3>
              <p>Founded with commitment to sustainable fashion</p>
            </TimelineItem>
            
            <TimelineItem>
              <h3>2021</h3>
              <p>Achieved 100% organic cotton sourcing</p>
            </TimelineItem>
            
            <TimelineItem>
              <h3>2022</h3>
              <p>Launched carbon-neutral shipping program</p>
            </TimelineItem>
            
            <TimelineItem>
              <h3>2023</h3>
              <p>Introduced take-back and recycling program</p>
            </TimelineItem>
            
            <TimelineItem>
              <h3>2024</h3>
              <p>Set goal for 100% sustainable materials by 2025</p>
            </TimelineItem>
          </TimelineGrid>
        </TimelineSection>

        <ContentSection>
          <ContentTitle>Certifications & Partnerships</ContentTitle>
          <ContentText>
            We're proud to be certified by leading sustainability organizations and work with 
            partners who share our commitment to environmental responsibility.
          </ContentText>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>🌿 GOTS Certified</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>Global Organic Textile Standard</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>♻️ B-Corp Certified</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>Benefit Corporation</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>🌍 Carbon Trust</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>Carbon Footprint Verified</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>🤝 Fair Trade</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>Ethical Supply Chain</p>
            </div>
          </div>
        </ContentSection>

        <CommitmentSection>
          <CommitmentTitle>Our Future Goals</CommitmentTitle>
          <CommitmentText>
            We're committed to continuous improvement and have set ambitious goals for the future 
            of sustainable fashion.
          </CommitmentText>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>2025 Goal</h3>
              <p style={{ color: '#666', margin: 0 }}>100% sustainable materials across all products</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>2026 Goal</h3>
              <p style={{ color: '#666', margin: 0 }}>Zero waste to landfill from our operations</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>2027 Goal</h3>
              <p style={{ color: '#666', margin: 0 }}>Net positive environmental impact</p>
            </div>
          </div>
        </CommitmentSection>

        <ContentSection>
          <ContentTitle>How You Can Help</ContentTitle>
          <ContentText>
            Sustainability is a shared responsibility. Here are some ways you can join us in 
            creating a more sustainable fashion future:
          </ContentText>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '0.75rem', color: '#1a1a1a' }}>🔄 Care for Your Clothes</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>Follow care instructions to extend the life of your garments</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '0.75rem', color: '#1a1a1a' }}>♻️ Participate in Take-Back</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>Return old clothes through our take-back program</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '0.75rem', color: '#1a1a1a' }}>🌱 Choose Quality Over Quantity</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>Invest in timeless pieces that last longer</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '0.75rem', color: '#1a1a1a' }}>📢 Spread the Word</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>Share our sustainability mission with others</p>
            </div>
          </div>
        </ContentSection>
      </ContentContainer>
    </SustainabilityContainer>
  );
};

export default Sustainability;
