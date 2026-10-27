import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { productsApi } from '../services/api';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Button, LoadingSpinner, ErrorMessage } from '../styles/App.styles';

const ProductDetailContainer = styled.div`
  padding-top: 100px;
  min-height: 100vh;
`;

const ProductContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
`;

const Thumbnail = styled.img<{ active?: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#1a1a1a' : 'transparent'};
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: #1a1a1a;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProductTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Price = styled.span<{ isSale?: boolean }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.isSale ? '#f44336' : '#1a1a1a'};
`;

const OriginalPrice = styled.span`
  font-size: 1.125rem;
  color: #999;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: #f44336;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ProductDescription = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1rem;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #666;
`;

const DetailValue = styled.span`
  color: #1a1a1a;
`;

const SizeSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SizeLabel = styled.label`
  font-weight: 500;
  color: #1a1a1a;
`;

const SizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  gap: 0.5rem;
`;

const SizeOption = styled.button<{ selected?: boolean; disabled?: boolean }>`
  padding: 8px 12px;
  border: 1px solid ${props => props.selected ? '#1a1a1a' : '#ddd'};
  background: ${props => props.selected ? '#1a1a1a' : 'white'};
  color: ${props => props.selected ? 'white' : '#1a1a1a'};
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    border-color: #1a1a1a;
  }
`;

const ColorSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ColorLabel = styled.label`
  font-weight: 500;
  color: #1a1a1a;
`;

const ColorGrid = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ColorOption = styled.button<{ selected?: boolean; color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? '#1a1a1a' : 'transparent'};
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityLabel = styled.label`
  font-weight: 500;
  color: #1a1a1a;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  padding: 8px 12px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #e5e5e5;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 8px;
  border: none;
  text-align: center;
  font-size: 1rem;
  
  &:focus {
    outline: none;
  }
`;

const AddToCartButton = styled(Button)`
  width: 100%;
  padding: 16px;
  font-size: 1.125rem;
  font-weight: 600;
`;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await productsApi.getById(id);
        setProduct(productData);
        if (productData.images.length > 0) {
          setSelectedImage(0);
        }
        if (productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0].size);
        }
        if (productData.colors.length > 0) {
          setSelectedColor(productData.colors[0].name);
        }
      } catch (err) {
        setError('Product not found');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        size: selectedSize,
        color: selectedColor,
        quantity,
      },
    });
    
    // Show success message or navigate to cart
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <ProductDetailContainer>
        <LoadingSpinner />
      </ProductDetailContainer>
    );
  }

  if (error || !product) {
    return (
      <ProductDetailContainer>
        <ErrorMessage>{error || 'Product not found'}</ErrorMessage>
      </ProductDetailContainer>
    );
  }

  return (
    <ProductDetailContainer>
      <ProductContent>
        <ImageSection>
          <MainImage
            src={product.images[selectedImage]?.url || '/placeholder-image.jpg'}
            alt={product.images[selectedImage]?.alt || product.name}
          />
          {product.images.length > 1 && (
            <ThumbnailGrid>
              {product.images.map((image, index) => (
                <Thumbnail
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  active={selectedImage === index}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </ThumbnailGrid>
          )}
        </ImageSection>

        <ProductInfo>
          <ProductTitle>{product.name}</ProductTitle>
          
          <PriceContainer>
            <Price isSale={product.isOnSale}>
              ${product.price.toFixed(2)}
            </Price>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <OriginalPrice>${product.originalPrice.toFixed(2)}</OriginalPrice>
                {product.discountPercentage > 0 && (
                  <DiscountBadge>-{product.discountPercentage}%</DiscountBadge>
                )}
              </>
            )}
          </PriceContainer>

          <ProductDescription>{product.description}</ProductDescription>

          <ProductDetails>
            <DetailRow>
              <DetailLabel>Category</DetailLabel>
              <DetailValue>{product.category.name}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Gender</DetailLabel>
              <DetailValue>{product.gender}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>Rating</DetailLabel>
              <DetailValue>
                ★ {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </DetailValue>
            </DetailRow>
          </ProductDetails>

          {product.sizes.length > 0 && (
            <SizeSelector>
              <SizeLabel>Size</SizeLabel>
              <SizeGrid>
                {product.sizes.map((size) => (
                  <SizeOption
                    key={size.size}
                    selected={selectedSize === size.size}
                    disabled={size.stock === 0}
                    onClick={() => setSelectedSize(size.size)}
                  >
                    {size.size}
                  </SizeOption>
                ))}
              </SizeGrid>
            </SizeSelector>
          )}

          {product.colors.length > 0 && (
            <ColorSelector>
              <ColorLabel>Color</ColorLabel>
              <ColorGrid>
                {product.colors.map((color) => (
                  <ColorOption
                    key={color.name}
                    color={color.hex}
                    selected={selectedColor === color.name}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </ColorGrid>
            </ColorSelector>
          )}

          <QuantitySelector>
            <QuantityLabel>Quantity</QuantityLabel>
            <QuantityControls>
              <QuantityButton
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </QuantityButton>
              <QuantityInput
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <QuantityButton
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </QuantityButton>
            </QuantityControls>
          </QuantitySelector>

          <AddToCartButton onClick={handleAddToCart}>
            Add to Cart
          </AddToCartButton>
        </ProductInfo>
      </ProductContent>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
