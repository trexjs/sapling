import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { productsApi } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Section, SectionTitle, Button, Grid, LoadingSpinner, ErrorMessage } from '../styles/App.styles';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
  color: white;
  padding: 120px 0 80px;
  text-align: center;
  
  @media (max-width: 768px) {
    padding: 100px 0 60px;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CategoryCard = styled(Link)`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const CategoryImage = styled.div<{ bg: string }>`
  width: 100%;
  height: 100%;
  background: ${props => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [featured, newProductsData, sale] = await Promise.all([
          productsApi.getFeatured(),
          productsApi.getNew(),
          productsApi.getOnSale(),
        ]);
        
        setFeaturedProducts(featured);
        setNewProducts(newProductsData);
        setSaleProducts(sale);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Discover Rare Fashion</HeroTitle>
          <HeroSubtitle>
            Premium clothing for the modern individual. Explore our exclusive collection of carefully curated pieces.
          </HeroSubtitle>
          <Button as={Link} to="/products" size="large">
            Shop Now
          </Button>
        </HeroContent>
      </HeroSection>

      <div className="container">
        <CategoryGrid>
          <CategoryCard to="/category/men">
            <CategoryImage bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              Men
            </CategoryImage>
          </CategoryCard>
          <CategoryCard to="/category/women">
            <CategoryImage bg="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
              Women
            </CategoryImage>
          </CategoryCard>
          <CategoryCard to="/category/kids">
            <CategoryImage bg="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              Kids
            </CategoryImage>
          </CategoryCard>
        </CategoryGrid>

        {featuredProducts.length > 0 && (
          <Section>
            <SectionTitle>Featured Products</SectionTitle>
            <Grid columns={4}>
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Grid>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button as={Link} to="/products?featured=true">
                View All Featured
              </Button>
            </div>
          </Section>
        )}

        {newProducts.length > 0 && (
          <Section>
            <SectionTitle>New Arrivals</SectionTitle>
            <Grid columns={4}>
              {newProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Grid>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button as={Link} to="/products?new=true">
                View All New Products
              </Button>
            </div>
          </Section>
        )}

        {saleProducts.length > 0 && (
          <Section>
            <SectionTitle>On Sale</SectionTitle>
            <Grid columns={4}>
              {saleProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </Grid>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button as={Link} to="/products?sale=true">
                View All Sale Items
              </Button>
            </div>
          </Section>
        )}
      </div>
    </>
  );
};

export default Home;
