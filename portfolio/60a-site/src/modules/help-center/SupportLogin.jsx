import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, AlertCircle } from 'lucide-react';

const SupportLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Hardcoded credentials for demo
  const DEMO_CREDENTIALS = {
    email: 'support@shiprocket.com',
    password: 'support123'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate credentials
    if (
      formData.email === DEMO_CREDENTIALS.email &&
      formData.password === DEMO_CREDENTIALS.password
    ) {
      // Set login status
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      
      // Redirect to ticket dashboard
      navigate('/tickets');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Package className="w-8 h-8 text-indigo-600" />
                <span className="text-xl font-bold text-gray-900">Shiprocket</span>
              </div>
              <span className="text-gray-600">Customer Support</span>
            </div>
            <Link to="/help-center" className="text-gray-600 hover:text-gray-900">
              Back to Help Center
            </Link>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Login to Support Portal
              </h2>
              <p className="text-sm text-gray-600">
                Access your support tickets and manage requests
              </p>
            </div>

            {/* Demo Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Email:</strong> support@shiprocket.com</p>
                <p><strong>Password:</strong> support123</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full font-medium py-2.5 rounded-md transition-all shadow-sm ${
                  isFormValid
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Login to Support Portal
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                Don't have access?{' '}
                <Link to="/help-center" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Browse Help Center
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportLogin;
