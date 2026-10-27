import React from "react";
import styled from "styled-components";
import { CMSProvider } from "./context/CMSContext";
import CMSEditor from "./components/CMSEditor";

const AppContainer = styled.div`
  min-height: 100vh;
`;

export const CMSApp: React.FC = () => {
  return (
    <CMSProvider>
      <AppContainer>
        <CMSEditor />
      </AppContainer>
    </CMSProvider>
  );
};
