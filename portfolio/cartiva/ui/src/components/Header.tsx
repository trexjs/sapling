import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  z-index: 1000;
  padding: 0 20px;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${props => props.active ? '#1a1a1a' : '#666'};
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #1a1a1a;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  font-size: 0.875rem;
  width: 200px;
  
  &:focus {
    outline: none;
    border-color: #1a1a1a;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CartButton = styled(Link)`
  position: relative;
  color: #1a1a1a;
  text-decoration: none;
  padding: 8px;
  
  &:hover {
    color: #666;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #1a1a1a;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
`;

const MobileMenuButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #1a1a1a;
  }
`;

const MobileMenu = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-bottom: 1px solid #e5e5e5;
    padding: 1rem 20px;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 0.5rem 0;
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #666;
  }
`;

const Header: React.FC = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">RARE</Logo>
        
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">All Products</NavLink>
          <NavLink to="/category/men">Men</NavLink>
          <NavLink to="/category/women">Women</NavLink>
          <NavLink to="/category/kids">Kids</NavLink>
        </Nav>
        
        <RightSection>
          <form onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <CartButton to="/cart">
            🛒
            {cartItemCount > 0 && <CartBadge>{cartItemCount}</CartBadge>}
          </CartButton>
          
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            ☰
          </MobileMenuButton>
        </RightSection>
      </HeaderContent>
      
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</MobileNavLink>
        <MobileNavLink to="/products" onClick={() => setIsMobileMenuOpen(false)}>All Products</MobileNavLink>
        <MobileNavLink to="/category/men" onClick={() => setIsMobileMenuOpen(false)}>Men</MobileNavLink>
        <MobileNavLink to="/category/women" onClick={() => setIsMobileMenuOpen(false)}>Women</MobileNavLink>
        <MobileNavLink to="/category/kids" onClick={() => setIsMobileMenuOpen(false)}>Kids</MobileNavLink>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;
