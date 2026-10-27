import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, Button } from '../../styles/App.styles';

const PressContainer = styled.div`
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

const PressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const PressCard = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1a1a1a;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const PressQuote = styled.blockquote`
  font-size: 1.125rem;
  font-style: italic;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  
  &::before {
    content: '"';
    font-size: 3rem;
    color: #1a1a1a;
    line-height: 1;
    margin-right: 0.5rem;
  }
`;

const PressSource = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PressLogo = styled.div`
  width: 40px;
  height: 40px;
  background: #1a1a1a;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const PressInfo = styled.div`
  h4 {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
  }
  
  p {
    color: #666;
    font-size: 0.875rem;
    margin: 0;
  }
`;

const MediaKitSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 8px;
  text-align: center;
  margin: 4rem 0;
`;

const MediaKitTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const MediaKitText = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const ContactSection = styled.div`
  background: #f8f9fa;
  padding: 3rem 2rem;
  border-radius: 8px;
  text-align: center;
  margin: 4rem 0;
`;

const ContactTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const ContactText = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const ContactInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ContactItem = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    margin: 0;
  }
`;

const Press: React.FC = () => {
  return (
    <PressContainer>
      <ContentContainer>
        <HeroSection>
          <HeroTitle>Press & Media</HeroTitle>
          <HeroSubtitle>
            Stay updated with the latest news, press releases, and media coverage about RARE Clothing.
          </HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <ContentTitle>Recent Press Coverage</ContentTitle>
          <ContentText>
            RARE Clothing has been featured in leading fashion and lifestyle publications, 
            recognized for our innovative designs and commitment to sustainability.
          </ContentText>
          
          <PressGrid>
            <PressCard>
              <PressQuote>
                RARE Clothing is revolutionizing the fashion industry with their commitment to 
                sustainable practices and inclusive design. Their latest collection showcases 
                the perfect blend of style and environmental consciousness.
              </PressQuote>
              <PressSource>
                <PressLogo>VF</PressLogo>
                <PressInfo>
                  <h4>Vogue Fashion</h4>
                  <p>March 2024</p>
                </PressInfo>
              </PressSource>
            </PressCard>
            
            <PressCard>
              <PressQuote>
                The brand's innovative approach to size inclusivity and sustainable manufacturing 
                sets a new standard for the industry. RARE is proving that fashion can be both 
                beautiful and responsible.
              </PressQuote>
              <PressSource>
                <PressLogo>SF</PressLogo>
                <PressInfo>
                  <h4>Sustainable Fashion</h4>
                  <p>February 2024</p>
                </PressInfo>
              </PressSource>
            </PressCard>
            
            <PressCard>
              <PressQuote>
                RARE's digital-first approach and seamless online shopping experience have made 
                them a standout in the competitive e-commerce landscape. Their customer-centric 
                approach is refreshing.
              </PressQuote>
              <PressSource>
                <PressLogo>TF</PressLogo>
                <PressInfo>
                  <h4>Tech Fashion</h4>
                  <p>January 2024</p>
                </PressInfo>
              </PressSource>
            </PressCard>
            
            <PressCard>
              <PressQuote>
                The brand's commitment to ethical production and fair labor practices makes them 
                a leader in responsible fashion. RARE is setting an example for the entire industry.
              </PressQuote>
              <PressSource>
                <PressLogo>EF</PressLogo>
                <PressInfo>
                  <h4>Ethical Fashion</h4>
                  <p>December 2023</p>
                </PressInfo>
              </PressSource>
            </PressCard>
            
            <PressCard>
              <PressQuote>
                RARE's innovative use of technology in fashion design and their commitment to 
                customer experience make them a brand to watch in 2024.
              </PressQuote>
              <PressSource>
                <PressLogo>FF</PressLogo>
                <PressInfo>
                  <h4>Future Fashion</h4>
                  <p>November 2023</p>
                </PressInfo>
              </PressSource>
            </PressCard>
            
            <PressCard>
              <PressQuote>
                The brand's focus on creating timeless pieces that transcend seasonal trends 
                resonates with consumers looking for quality and longevity in their wardrobe.
              </PressQuote>
              <PressSource>
                <PressLogo>LF</PressLogo>
                <PressInfo>
                  <h4>Lifestyle Fashion</h4>
                  <p>October 2023</p>
                </PressInfo>
              </PressSource>
            </PressCard>
          </PressGrid>
        </ContentSection>

        <ContentSection>
          <ContentTitle>Press Releases</ContentTitle>
          <ContentText>
            Stay informed about our latest announcements, product launches, and company milestones.
          </ContentText>
          
          <div style={{ marginTop: '2rem' }}>
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>RARE Clothing Launches Sustainable Spring Collection</h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>March 15, 2024</p>
              <p style={{ color: '#666', margin: 0 }}>New collection features 100% organic cotton and recycled materials...</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>RARE Partners with Local Artisans for Limited Edition Collection</h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>February 28, 2024</p>
              <p style={{ color: '#666', margin: 0 }}>Collaboration celebrates traditional craftsmanship and modern design...</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', marginBottom: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>RARE Clothing Expands International Shipping to 20 New Countries</h3>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>February 10, 2024</p>
              <p style={{ color: '#666', margin: 0 }}>Global expansion brings RARE's sustainable fashion to new markets...</p>
            </div>
          </div>
        </ContentSection>

        <MediaKitSection>
          <MediaKitTitle>Media Kit</MediaKitTitle>
          <MediaKitText>
            Download our media kit for high-resolution images, brand assets, and company information 
            for your editorial coverage.
          </MediaKitText>
          <Button variant="outline" size="large" style={{ background: 'white', color: '#1a1a1a' }}>
            Download Media Kit
          </Button>
        </MediaKitSection>

        <ContactSection>
          <ContactTitle>Media Inquiries</ContactTitle>
          <ContactText>
            For press inquiries, interview requests, or media partnerships, please contact our 
            communications team.
          </ContactText>
          
          <ContactInfo>
            <ContactItem>
              <h3>Press Contact</h3>
              <p>press@rareclothing.com</p>
            </ContactItem>
            
            <ContactItem>
              <h3>Media Relations</h3>
              <p>media@rareclothing.com</p>
            </ContactItem>
            
            <ContactItem>
              <h3>Partnerships</h3>
              <p>partnerships@rareclothing.com</p>
            </ContactItem>
            
            <ContactItem>
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </ContactItem>
          </ContactInfo>
        </ContactSection>

        <ContentSection>
          <ContentTitle>Awards & Recognition</ContentTitle>
          <ContentText>
            RARE Clothing has been recognized by industry leaders for our innovation, sustainability, 
            and commitment to excellence.
          </ContentText>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>🏆 Best Sustainable Fashion Brand 2024</h3>
              <p style={{ color: '#666', margin: 0 }}>Fashion Forward Awards</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>🌟 Innovation in E-commerce 2024</h3>
              <p style={{ color: '#666', margin: 0 }}>Digital Fashion Awards</p>
            </div>
            
            <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '0.5rem', color: '#1a1a1a' }}>🌱 Environmental Excellence 2023</h3>
              <p style={{ color: '#666', margin: 0 }}>Green Fashion Council</p>
            </div>
          </div>
        </ContentSection>
      </ContentContainer>
    </PressContainer>
  );
};

export default Press;
