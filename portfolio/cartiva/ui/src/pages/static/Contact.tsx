import React, { useState } from 'react';
import styled from 'styled-components';
import { Section, SectionTitle, Button } from '../../styles/App.styles';

const ContactContainer = styled.div`
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2rem;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const ContactIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 1rem;
  color: #1a1a1a;
`;

const ContactDetails = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 0.25rem;
  }
  
  p {
    color: #666;
    margin: 0;
  }
`;

const ContactForm = styled.form`
  h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
`;

const FAQSection = styled.div`
  margin-top: 4rem;
  
  h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const FAQGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FAQItem = styled.div`
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

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      inquiryType: ''
    });
  };

  return (
    <ContactContainer>
      <ContentContainer>
        <HeroSection>
          <HeroTitle>Contact Us</HeroTitle>
          <HeroSubtitle>
            We'd love to hear from you. Get in touch with our team for any questions or support.
          </HeroSubtitle>
        </HeroSection>

        <ContactGrid>
          <ContactInfo>
            <h2>Get in Touch</h2>
            
            <ContactItem>
              <ContactIcon>📧</ContactIcon>
              <ContactDetails>
                <h3>Email</h3>
                <p>hello@rareclothing.com</p>
              </ContactDetails>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>📞</ContactIcon>
              <ContactDetails>
                <h3>Phone</h3>
                <p>+1 (555) 123-4567</p>
              </ContactDetails>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>📍</ContactIcon>
              <ContactDetails>
                <h3>Address</h3>
                <p>123 Fashion Street<br />New York, NY 10001</p>
              </ContactDetails>
            </ContactItem>
            
            <ContactItem>
              <ContactIcon>🕒</ContactIcon>
              <ContactDetails>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9AM - 6PM<br />Saturday: 10AM - 4PM</p>
              </ContactDetails>
            </ContactItem>
          </ContactInfo>

          <ContactForm onSubmit={handleSubmit}>
            <h2>Send us a Message</h2>
            
            <FormGroup>
              <FormLabel htmlFor="name">Full Name *</FormLabel>
              <FormInput
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="email">Email Address *</FormLabel>
              <FormInput
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="inquiryType">Inquiry Type</FormLabel>
              <FormSelect
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleInputChange}
              >
                <option value="">Select an option</option>
                <option value="general">General Inquiry</option>
                <option value="order">Order Support</option>
                <option value="return">Returns & Exchanges</option>
                <option value="size">Size Guide</option>
                <option value="other">Other</option>
              </FormSelect>
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="subject">Subject *</FormLabel>
              <FormInput
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="message">Message *</FormLabel>
              <FormTextarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us how we can help you..."
                required
              />
            </FormGroup>
            
            <Button type="submit" size="large">
              Send Message
            </Button>
          </ContactForm>
        </ContactGrid>

        <FAQSection>
          <h2>Frequently Asked Questions</h2>
          <FAQGrid>
            <FAQItem>
              <h3>How long does shipping take?</h3>
              <p>Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days.</p>
            </FAQItem>
            
            <FAQItem>
              <h3>What is your return policy?</h3>
              <p>We offer 30-day returns on all items in original condition with tags attached.</p>
            </FAQItem>
            
            <FAQItem>
              <h3>Do you ship internationally?</h3>
              <p>Yes, we ship to over 50 countries worldwide. International shipping takes 7-14 business days.</p>
            </FAQItem>
            
            <FAQItem>
              <h3>How can I track my order?</h3>
              <p>You'll receive a tracking number via email once your order ships. You can also track it in your account.</p>
            </FAQItem>
            
            <FAQItem>
              <h3>What payment methods do you accept?</h3>
              <p>We accept all major credit cards, PayPal, Apple Pay, and Google Pay.</p>
            </FAQItem>
            
            <FAQItem>
              <h3>How do I find my size?</h3>
              <p>Check our detailed size guide for each product, or contact our customer service team for assistance.</p>
            </FAQItem>
          </FAQGrid>
        </FAQSection>
      </ContentContainer>
    </ContactContainer>
  );
};

export default Contact;
