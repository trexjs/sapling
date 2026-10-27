import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { KingsmanProvider } from "./context/KingsmanContext";
import "./index.css";

const theme = {
  palette: {
    primary: "#1e293b",
    accent: "#38bdf8",
    background: "#f8fafc",
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <KingsmanProvider>
        <App />
      </KingsmanProvider>
    </ThemeProvider>
  </StrictMode>
);
