import styled from 'styled-components';

// Helper function to create styled components with automatic display names
export const createStyledComponent = <T extends keyof JSX.IntrinsicElements>(
  element: T,
  componentName: string
) => {
  const StyledComponent = styled(element);
  StyledComponent.displayName = `styles_${componentName}`;
  return StyledComponent;
};

// Pre-configured styled components with names
export const styledDiv = (name: string) => createStyledComponent('div', name);
export const styledButton = (name: string) => createStyledComponent('button', name);
export const styledInput = (name: string) => createStyledComponent('input', name);
export const styledForm = (name: string) => createStyledComponent('form', name);
export const styledSection = (name: string) => createStyledComponent('section', name);
export const styledArticle = (name: string) => createStyledComponent('article', name);
export const styledHeader = (name: string) => createStyledComponent('header', name);
export const styledMain = (name: string) => createStyledComponent('main', name);
export const styledNav = (name: string) => createStyledComponent('nav', name);
export const styledFooter = (name: string) => createStyledComponent('footer', name);
export const styledSpan = (name: string) => createStyledComponent('span', name);
export const styledP = (name: string) => createStyledComponent('p', name);
export const styledH1 = (name: string) => createStyledComponent('h1', name);
export const styledH2 = (name: string) => createStyledComponent('h2', name);
export const styledH3 = (name: string) => createStyledComponent('h3', name);
export const styledH4 = (name: string) => createStyledComponent('h4', name);
export const styledH5 = (name: string) => createStyledComponent('h5', name);
export const styledH6 = (name: string) => createStyledComponent('h6', name);
export const styledUl = (name: string) => createStyledComponent('ul', name);
export const styledLi = (name: string) => createStyledComponent('li', name);
export const styledA = (name: string) => createStyledComponent('a', name);
export const styledImg = (name: string) => createStyledComponent('img', name);
