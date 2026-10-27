import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout.tsx";
import { DashboardPage } from "./pages/Dashboard.tsx";
import { RealmsPage } from "./pages/Realms.tsx";
import { UsersPage } from "./pages/Users.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/realms" element={<RealmsPage />} />
          <Route path="/realms/:realmId/users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
