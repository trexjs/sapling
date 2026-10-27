import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="text-4xl font-bold text-gray-900">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 5 L15 35 L20 20 L25 35 L35 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          {children}
        </div>
      </div>

      {/* Right Side - Product Image/Demo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-white to-blue-100 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative background lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 100" stroke="rgba(251, 146, 60, 0.15)" strokeWidth="1" fill="none" />
                <path d="M 0 0 L 100 100" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Product Screenshot/Demo */}
        <div className="relative z-10 w-full flex items-center justify-center">
          <img 
            src="https://exafunction.github.io/public/images/auth/ide_light.png" 
            alt="Product IDE Interface"
            className="w-full max-w-3xl h-auto rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
