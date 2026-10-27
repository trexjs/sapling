import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Button, LoadingSpinner, ErrorMessage } from '../styles/App.styles';

const CartContainer = styled.div`
  padding-top: 100px;
  min-height: 100vh;
`;

const CartContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const CartHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const CartTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const CartSubtitle = styled.p`
  font-size: 1.125rem;
  color: #666;
`;

const CartGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CartItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ItemImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ItemName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  color: #666;
  font-size: 0.875rem;
`;

const ItemPrice = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: auto;
`;

const ItemControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
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

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #f44336;
  cursor: pointer;
  font-size: 0.875rem;
  text-decoration: underline;
  
  &:hover {
    color: #d32f2f;
  }
`;

const CartSummary = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 120px;
`;

const SummaryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #666;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
  margin-top: 1rem;
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-top: 1.5rem;
  padding: 16px;
  font-size: 1.125rem;
  font-weight: 600;
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const EmptyCartTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const EmptyCartText = styled.p`
  color: #666;
  margin-bottom: 2rem;
`;

const Cart: React.FC = () => {
  const { state, dispatch } = useApp();
  const { cart } = state;

  const updateQuantity = (productId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: productId,
      });
    } else {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { id: productId, quantity: newQuantity },
      });
    }
  };

  const removeItem = (productId: string) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: productId,
    });
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  if (cart.length === 0) {
    return (
      <CartContainer>
        <CartContent>
          <EmptyCart>
            <EmptyCartTitle>Your cart is empty</EmptyCartTitle>
            <EmptyCartText>
              Looks like you haven't added any items to your cart yet.
            </EmptyCartText>
            <Button as={Link} to="/products">
              Continue Shopping
            </Button>
          </EmptyCart>
        </CartContent>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartContent>
        <CartHeader>
          <CartTitle>Shopping Cart</CartTitle>
          <CartSubtitle>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </CartSubtitle>
        </CartHeader>

        <CartGrid>
          <CartItems>
            {cart.map((item, index) => (
              <CartItem key={`${item.product._id}-${item.size}-${item.color}`}>
                <ItemImage
                  src={item.product.images[0]?.url || '/placeholder-image.jpg'}
                  alt={item.product.images[0]?.alt || item.product.name}
                />
                
                <ItemDetails>
                  <ItemName>{item.product.name}</ItemName>
                  <ItemInfo>
                    <div>Size: {item.size}</div>
                    <div>Color: {item.color}</div>
                    <div>Category: {item.product.category.name}</div>
                  </ItemInfo>
                  <ItemPrice>${(item.product.price * item.quantity).toFixed(2)}</ItemPrice>
                </ItemDetails>
                
                <ItemControls>
                  <QuantityControls>
                    <QuantityButton
                      onClick={() => updateQuantity(
                        item.product._id,
                        item.size,
                        item.color,
                        item.quantity - 1
                      )}
                    >
                      -
                    </QuantityButton>
                    <QuantityInput
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(
                        item.product._id,
                        item.size,
                        item.color,
                        parseInt(e.target.value) || 1
                      )}
                      min="1"
                    />
                    <QuantityButton
                      onClick={() => updateQuantity(
                        item.product._id,
                        item.size,
                        item.color,
                        item.quantity + 1
                      )}
                    >
                      +
                    </QuantityButton>
                  </QuantityControls>
                  
                  <RemoveButton
                    onClick={() => removeItem(item.product._id)}
                  >
                    Remove
                  </RemoveButton>
                </ItemControls>
              </CartItem>
            ))}
          </CartItems>
          
          <CartSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            <SummaryRow>
              <span>Subtotal</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </SummaryRow>
            
            <SummaryRow>
              <span>Tax</span>
              <span>${calculateTax().toFixed(2)}</span>
            </SummaryRow>
            
            <SummaryTotal>
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </SummaryTotal>
            
            <CheckoutButton>
              Proceed to Checkout
            </CheckoutButton>
            
            <Button
              variant="outline"
              as={Link}
              to="/products"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Continue Shopping
            </Button>
          </CartSummary>
        </CartGrid>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
