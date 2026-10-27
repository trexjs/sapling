import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppWrapper } from "./common/layout/index.tsx";
import { DCSApp } from "./dcs/App.tsx";
import { CMSApp } from "./editor/App.tsx";
import { ConfigApp } from "./config/App.tsx";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppWrapper>
        <Routes>
          {/* Define routes for each sub-app */}
          <Route path="/config/*" element={<ConfigApp />} />
          <Route path="/cms/*" element={<CMSApp />} />
          <Route path="/dcs/*" element={<DCSApp />} />

          {/* Default redirect to ConfigApp or a Dashboard */}
          <Route path="/" element={<Navigate to="/config" replace />} />
        </Routes>
      </AppWrapper>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
