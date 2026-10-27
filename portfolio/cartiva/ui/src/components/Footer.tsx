import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #1a1a1a;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: white;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: white;
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #333;
  padding-top: 1rem;
  text-align: center;
  color: #999;
  font-size: 0.875rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #333;
    border-radius: 50%;
    color: white;
    text-decoration: none;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: #555;
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>RARE</h3>
            <p style={{ color: '#ccc', lineHeight: '1.6' }}>
              Premium fashion for the modern individual. Discover our exclusive collection of clothing designed for men, women, and kids.
            </p>
            <SocialLinks>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Pinterest">📌</a>
            </SocialLinks>
          </FooterSection>
          
          <FooterSection>
            <h3>Shop</h3>
            <ul>
              <li><Link to="/category/men">Men's Collection</Link></li>
              <li><Link to="/category/women">Women's Collection</Link></li>
              <li><Link to="/category/kids">Kids' Collection</Link></li>
              <li><Link to="/products">All Products</Link></li>
            </ul>
          </FooterSection>
          
          <FooterSection>
            <h3>Customer Service</h3>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
            </ul>
          </FooterSection>
          
          <FooterSection>
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/sustainability">Sustainability</Link></li>
            </ul>
          </FooterSection>
        </FooterGrid>
        
        <FooterBottom>
          <p>&copy; 2024 RARE Clothing. All rights reserved.</p>
        </FooterBottom>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
