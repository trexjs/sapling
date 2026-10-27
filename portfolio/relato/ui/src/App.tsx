import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { GlobalStyles } from './components/styled/GlobalStyles';
import routes from './routes';

const App: React.FC = () => {
  return (
    <AppProvider>
      <GlobalStyles />
      {/* <DebugAuth /> */}
      <Router>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
