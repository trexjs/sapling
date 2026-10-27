import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Button } from '../../../../src/components/Button';

const ArrowUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="24"
    height="24"
  >
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const ScrollButton = styled(Button)({
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  padding: 0,
  minWidth: '48px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'opacity 0.3s, transform 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  '&.hidden': {
    opacity: 0,
    pointerEvents: 'none',
    transform: 'translateY(10px)',
  },
});

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <ScrollButton
      variant="primary"
      onClick={scrollToTop}
      className={isVisible ? '' : 'hidden'}
      aria-label="Scroll to top"
    >
      <ArrowUpIcon />
    </ScrollButton>
  );
};

export default ScrollToTop;
