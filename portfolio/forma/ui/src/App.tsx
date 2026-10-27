import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormView from './pages/FormView';
import Responses from './pages/Responses';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`;

function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/form/:id" element={<FormBuilder />} />
        <Route path="/form/:id/edit" element={<FormBuilder />} />
        <Route path="/form/:id/responses" element={<Responses />} />
        <Route path="/f/:id" element={<FormView />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
