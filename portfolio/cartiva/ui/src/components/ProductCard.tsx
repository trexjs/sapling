import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Product } from '../types';

const CardContainer = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const Badge = styled.div<{ type: 'new' | 'sale' | 'featured' }>`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.type) {
      case 'new':
        return 'background-color: #4CAF50; color: white;';
      case 'sale':
        return 'background-color: #f44336; color: white;';
      case 'featured':
        return 'background-color: #ff9800; color: white;';
      default:
        return 'background-color: #666; color: white;';
    }
  }}
`;

const Content = styled.div`
  padding: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  line-height: 1.4;
  
  /* Truncate text to 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Price = styled.span<{ isSale?: boolean }>`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${props => props.isSale ? '#f44336' : '#1a1a1a'};
`;

const OriginalPrice = styled.span`
  font-size: 0.875rem;
  color: #999;
  text-decoration: line-through;
`;

const DiscountPercentage = styled.span`
  font-size: 0.75rem;
  color: #f44336;
  font-weight: 600;
`;

const ProductInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #666;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Star = styled.span`
  color: #ffc107;
  font-size: 0.875rem;
`;

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const getBadgeType = () => {
    if (product.isNew) return 'new';
    if (product.isOnSale) return 'sale';
    if (product.isFeatured) return 'featured';
    return null;
  };

  const badgeType = getBadgeType();

  return (
    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
      <CardContainer>
        <ImageContainer>
          <ProductImage
            src={product.images[0]?.url || '/placeholder-image.jpg'}
            alt={product.images[0]?.alt || product.name}
          />
          {badgeType && (
            <Badge type={badgeType}>
              {badgeType === 'new' && 'New'}
              {badgeType === 'sale' && 'Sale'}
              {badgeType === 'featured' && 'Featured'}
            </Badge>
          )}
        </ImageContainer>
        
        <Content>
          <ProductName>{product.name}</ProductName>
          
          <PriceContainer>
            <Price isSale={product.isOnSale}>
              ${product.price.toFixed(2)}
            </Price>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <OriginalPrice>${product.originalPrice.toFixed(2)}</OriginalPrice>
                {product.discountPercentage > 0 && (
                  <DiscountPercentage>
                    -{product.discountPercentage}%
                  </DiscountPercentage>
                )}
              </>
            )}
          </PriceContainer>
          
          <ProductInfo>
            <Rating>
              <Star>★</Star>
              <span>{product.rating.toFixed(1)}</span>
              <span>({product.reviewCount})</span>
            </Rating>
            <span>{product.gender}</span>
          </ProductInfo>
        </Content>
      </CardContainer>
    </Link>
  );
};

export default ProductCard;
