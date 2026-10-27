import styled from 'styled-components';

// Helper function to create styled components with readable class names
export const createStyledComponent = <T extends keyof JSX.IntrinsicElements>(
  element: T,
  componentName: string
) => {
  const StyledComponent = styled(element);
  StyledComponent.displayName = `styles_${componentName}`;
  return StyledComponent;
};

// Helper function for div elements
export const styledDiv = (componentName: string) => {
  const StyledComponent = styled.div;
  StyledComponent.displayName = `styles_${componentName}`;
  return StyledComponent;
};

// Helper function for button elements
export const styledButton = (componentName: string) => {
  const StyledComponent = styled.button;
  StyledComponent.displayName = `styles_${componentName}`;
  return StyledComponent;
};

// Helper function for input elements
export const styledInput = (componentName: string) => {
  const StyledComponent = styled.input;
  StyledComponent.displayName = `styles_${componentName}`;
  return StyledComponent;
};

// Helper function for form elements
export const styledForm = (componentName: string) => {
  const StyledComponent = styled.form;
  StyledComponent.displayName = `styles_${componentName}`;
  return StyledComponent;
};

// Helper function for section elements
export const styledSection = (componentName: string) => {
  const StyledComponent = styled.section;
  StyledComponent.displayName = `styles_${componentName}`;
  return StyledComponent;
};

// Helper function for article elements
export const styledArticle = (componentName: string) => {
  const StyledComponent = styled.article;
  StyledComponent.displayName = `styles_${componentName}`;
  return StyledComponent;
};

// Generic helper function
export const styledWithName = (element: any, componentName: string) => {
  const StyledComponent = styled(element);
  StyledComponent.displayName = `styles_${componentName}`;
  return StyledComponent;
};
