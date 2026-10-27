import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const DebugAuth: React.FC = () => {
  const { user, isAuthenticated, loading } = useApp();
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      setDebugInfo({
        hasToken: !!token,
        tokenLength: token?.length || 0,
        hasRefreshToken: !!refreshToken,
        refreshTokenLength: refreshToken?.length || 0,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'None',
        user,
        isAuthenticated,
        loading
      });

      // Test server connectivity
      try {
        const response = await fetch('http://localhost:5000/api/auth/health');
        const data = await response.json();
        setDebugInfo(prev => ({
          ...prev,
          serverStatus: response.status,
          serverResponse: data
        }));
      } catch (error) {
        setDebugInfo(prev => ({
          ...prev,
          serverError: error.message
        }));
      }

      // Test auth endpoint if token exists
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/test-auth', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          setDebugInfo(prev => ({
            ...prev,
            testAuthStatus: response.status,
            testAuthResponse: data
          }));
        } catch (error) {
          setDebugInfo(prev => ({
            ...prev,
            testAuthError: error.message
          }));
        }
      }

      // Test profile endpoint if token exists
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          setDebugInfo(prev => ({
            ...prev,
            profileStatus: response.status,
            profileResponse: data
          }));
        } catch (error) {
          setDebugInfo(prev => ({
            ...prev,
            profileError: error.message
          }));
        }
      }
    };

    checkAuth();
  }, [user, isAuthenticated, loading]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      maxWidth: '400px',
      maxHeight: '80vh',
      overflowY: 'auto',
      zIndex: 9999,
      fontSize: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Auth Debug Info</h3>
      <pre style={{ 
        margin: 0, 
        whiteSpace: 'pre-wrap', 
        wordBreak: 'break-word',
        fontSize: '11px',
        lineHeight: '1.4'
      }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};

export default DebugAuth;
