import React from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, Button } from '../../styles/App.styles';

const CareersContainer = styled.div`
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

const JobGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const JobCard = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const JobTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
`;

const JobLocation = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const JobType = styled.span`
  display: inline-block;
  background: #1a1a1a;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const JobDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const JobRequirements = styled.ul`
  color: #666;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
  padding-left: 1.5rem;
`;

const BenefitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const BenefitCard = styled.div`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const BenefitIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const BenefitTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
`;

const BenefitDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const CultureSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  padding: 4rem 2rem;
  border-radius: 8px;
  text-align: center;
  margin: 4rem 0;
`;

const CultureTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const CultureText = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

const ApplicationSection = styled.div`
  background: #f8f9fa;
  padding: 3rem 2rem;
  border-radius: 8px;
  text-align: center;
  margin: 4rem 0;
`;

const ApplicationTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const ApplicationText = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const Careers: React.FC = () => {
  return (
    <CareersContainer>
      <ContentContainer>
        <HeroSection>
          <HeroTitle>Join Our Team</HeroTitle>
          <HeroSubtitle>
            Be part of a dynamic team that's shaping the future of fashion. We're looking for passionate, 
            creative individuals who share our vision.
          </HeroSubtitle>
        </HeroSection>

        <ContentSection>
          <ContentTitle>Why Work at RARE?</ContentTitle>
          <ContentText>
            At RARE, we believe our people are our greatest asset. We're committed to creating an 
            inclusive, innovative environment where everyone can thrive and grow.
          </ContentText>
          
          <BenefitsGrid>
            <BenefitCard>
              <BenefitIcon>💼</BenefitIcon>
              <BenefitTitle>Career Growth</BenefitTitle>
              <BenefitDescription>
                Opportunities for advancement and professional development in a fast-growing company
              </BenefitDescription>
            </BenefitCard>
            
            <BenefitCard>
              <BenefitIcon>🏠</BenefitIcon>
              <BenefitTitle>Flexible Work</BenefitTitle>
              <BenefitDescription>
                Remote work options and flexible schedules to support work-life balance
              </BenefitDescription>
            </BenefitCard>
            
            <BenefitCard>
              <BenefitIcon>🎨</BenefitIcon>
              <BenefitTitle>Creative Freedom</BenefitTitle>
              <BenefitDescription>
                Express your creativity and contribute to innovative fashion solutions
              </BenefitDescription>
            </BenefitCard>
            
            <BenefitCard>
              <BenefitIcon>🤝</BenefitIcon>
              <BenefitTitle>Inclusive Culture</BenefitTitle>
              <BenefitDescription>
                Diverse, inclusive workplace where everyone's voice is heard and valued
              </BenefitDescription>
            </BenefitCard>
            
            <BenefitCard>
              <BenefitIcon>💰</BenefitIcon>
              <BenefitTitle>Competitive Benefits</BenefitTitle>
              <BenefitDescription>
                Comprehensive health, dental, and retirement benefits for all employees
              </BenefitDescription>
            </BenefitCard>
            
            <BenefitCard>
              <BenefitIcon>🎓</BenefitIcon>
              <BenefitTitle>Learning & Development</BenefitTitle>
              <BenefitDescription>
                Continuous learning opportunities and skill development programs
              </BenefitDescription>
            </BenefitCard>
          </BenefitsGrid>
        </ContentSection>

        <CultureSection>
          <CultureTitle>Our Culture</CultureTitle>
          <CultureText>
            We're a team of passionate individuals who believe in the power of fashion to express 
            individuality and create positive change. Join us in building a more sustainable, 
            inclusive future for fashion.
          </CultureText>
        </CultureSection>

        <ContentSection>
          <ContentTitle>Open Positions</ContentTitle>
          <ContentText>
            We're always looking for talented individuals to join our team. Here are our current openings:
          </ContentText>
          
          <JobGrid>
            <JobCard>
              <JobTitle>Senior Fashion Designer</JobTitle>
              <JobLocation>New York, NY</JobLocation>
              <JobType>Full-time</JobType>
              <JobDescription>
                Lead the design of our seasonal collections, working closely with the creative team 
                to develop innovative and sustainable fashion solutions.
              </JobDescription>
              <JobRequirements>
                <li>5+ years experience in fashion design</li>
                <li>Strong portfolio of contemporary designs</li>
                <li>Proficiency in Adobe Creative Suite</li>
                <li>Knowledge of sustainable fashion practices</li>
              </JobRequirements>
            </JobCard>
            
            <JobCard>
              <JobTitle>Digital Marketing Manager</JobTitle>
              <JobLocation>Remote</JobLocation>
              <JobType>Full-time</JobType>
              <JobDescription>
                Develop and execute digital marketing strategies to grow our online presence and 
                drive customer engagement across all digital channels.
              </JobDescription>
              <JobRequirements>
                <li>3+ years digital marketing experience</li>
                <li>Experience with social media advertising</li>
                <li>Analytics and data-driven decision making</li>
                <li>Fashion industry experience preferred</li>
              </JobRequirements>
            </JobCard>
            
            <JobCard>
              <JobTitle>Customer Experience Specialist</JobTitle>
              <JobLocation>Remote</JobLocation>
              <JobType>Full-time</JobType>
              <JobDescription>
                Provide exceptional customer service and support, helping customers with orders, 
                returns, and general inquiries to ensure a positive shopping experience.
              </JobDescription>
              <JobRequirements>
                <li>2+ years customer service experience</li>
                <li>Excellent communication skills</li>
                <li>Experience with CRM systems</li>
                <li>Passion for fashion and customer satisfaction</li>
              </JobRequirements>
            </JobCard>
            
            <JobCard>
              <JobTitle>Frontend Developer</JobTitle>
              <JobLocation>Remote</JobLocation>
              <JobType>Full-time</JobType>
              <JobDescription>
                Build and maintain our e-commerce platform, creating seamless user experiences 
                and implementing new features to enhance customer engagement.
              </JobDescription>
              <JobRequirements>
                <li>3+ years frontend development experience</li>
                <li>Proficiency in React, TypeScript, and modern web technologies</li>
                <li>Experience with e-commerce platforms</li>
                <li>Strong problem-solving and collaboration skills</li>
              </JobRequirements>
            </JobCard>
            
            <JobCard>
              <JobTitle>Supply Chain Coordinator</JobTitle>
              <JobLocation>Los Angeles, CA</JobLocation>
              <JobType>Full-time</JobType>
              <JobDescription>
                Manage relationships with suppliers and manufacturers, ensuring quality standards 
                and sustainable practices throughout our supply chain.
              </JobDescription>
              <JobRequirements>
                <li>3+ years supply chain experience</li>
                <li>Knowledge of sustainable manufacturing practices</li>
                <li>Strong negotiation and relationship management skills</li>
                <li>Experience in fashion or retail industry</li>
              </JobRequirements>
            </JobCard>
            
            <JobCard>
              <JobTitle>Content Creator</JobTitle>
              <JobLocation>Remote</JobLocation>
              <JobType>Part-time</JobType>
              <JobDescription>
                Create engaging content for our social media channels and website, including 
                photography, videography, and written content that showcases our brand values.
              </JobDescription>
              <JobRequirements>
                <li>Portfolio of creative content work</li>
                <li>Experience with social media platforms</li>
                <li>Photography and video editing skills</li>
                <li>Understanding of fashion trends and brand voice</li>
              </JobRequirements>
            </JobCard>
          </JobGrid>
        </ContentSection>

        <ApplicationSection>
          <ApplicationTitle>Ready to Join Us?</ApplicationTitle>
          <ApplicationText>
            Don't see a position that matches your skills? We're always interested in hearing from 
            talented individuals who share our passion for fashion and innovation.
          </ApplicationText>
          <Button size="large">
            Apply Now
          </Button>
        </ApplicationSection>

        <ContentSection>
          <ContentTitle>Application Process</ContentTitle>
          <ContentText>
            Our hiring process is designed to be transparent and efficient. Here's what you can expect:
          </ContentText>
          <ContentText>
            <strong>1. Application Review:</strong> We review all applications within 1 week of submission.<br/>
            <strong>2. Initial Interview:</strong> Phone or video interview to discuss your background and interests.<br/>
            <strong>3. Skills Assessment:</strong> Practical assessment relevant to the role.<br/>
            <strong>4. Final Interview:</strong> Meet with the team and learn more about our culture.<br/>
            <strong>5. Decision:</strong> We aim to make decisions within 2 weeks of the final interview.
          </ContentText>
        </ContentSection>
      </ContentContainer>
    </CareersContainer>
  );
};

export default Careers;
