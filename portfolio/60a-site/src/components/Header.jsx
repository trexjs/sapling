import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, BarChart3, Shield, Zap, FileText, Users, Briefcase, Phone , GroupIcon } from 'lucide-react';

const Header = ({ onDemoClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const location = useLocation();

  const productItems = [
    { name: 'Product Overview', description: 'Data intelligence platform for delivering embedded AI agents', icon: <BarChart3 className="h-5 w-5" />, href: '/#features', category: 'FEATURED' },
    { name: 'Form Builder', description: 'Create powerful online forms with AI and automation', icon: <FileText className="h-5 w-5" />, href: '/products/formbuilder', category: 'FEATURED' },
    { name: 'Business Intelligence', description: 'Actionable analytics', icon: <BarChart3 className="h-5 w-5" />, href: '/#features', category: 'EXPLORE GOODDATA' },
    { name: 'Analytics Lake', description: 'Composable data service layer', icon: <Shield className="h-5 w-5" />, href: '/#features', category: 'EXPLORE GOODDATA' },
    { name: 'AI Assistant', description: 'Conversational analytics', icon: <Zap className="h-5 w-5" />, href: '/#features', category: 'EXPLORE GOODDATA' },
    { name: 'Security & Compliance', description: 'Trusted data protection and privacy', icon: <Shield className="h-5 w-5" />, href: '/#features', category: 'EXPLORE GOODDATA' },
    { name: 'Query Acceleration', description: 'Impressive query and caching', icon: <Zap className="h-5 w-5" />, href: '/#features', category: 'EXPLORE GOODDATA' },
    { name: 'Headless BI', description: 'Open semantic layer', icon: <BarChart3 className="h-5 w-5" />, href: '/#features', category: 'EXPLORE GOODDATA' },
    { name: 'Data Visualization', description: 'Self-service and dashboards', icon: <BarChart3 className="h-5 w-5" />, href: '/#features', category: 'EXPLORE GOODDATA' },
    { name: 'Data Monetization', description: 'Analytics as a revenue stream', icon: <Shield className="h-5 w-5" />, href: '/#features', category: 'EXPLORE GOODDATA' },
    { name: 'Data Automation', description: 'Automate exports and alerts', icon: <Zap className="h-5 w-5" />, href: '/#features', category: 'EXPLORE GOODDATA' },
  ];

  const resourceItems = [
    { name: 'Blog', description: 'Latest insights & trends', icon: <FileText className="h-5 w-5" />, href: '/blog' },
    { name: 'About Us', description: 'Our story and mission', icon: <Users className="h-5 w-5" />, href: '/about' },
    { name: 'Careers', description: 'Join our team', icon: <Briefcase className="h-5 w-5" />, href: '/careers' },
    { name: 'Partners', description: 'Our partners', icon: <GroupIcon className="h-5 w-5" />, href: '/partners' },
    { name: 'Contact', description: 'Contact us', icon: <Phone className="h-5 w-5" />, href: '/contact' },
  ];

  // Mobile navigation items
  const mobileNavigation = [
    ...productItems.map(item => ({ ...item, category: 'Products' })),
    { name: 'Pricing', href: '/pricing', current: location.pathname === '/pricing' },
    ...resourceItems.map(item => ({ ...item, category: 'Resources' })),
  ];

  return (
    <>
    <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full border-b border-gray-100">
      <nav className="px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex items-center justify-between py-4 lg:py-5 min-h-[60px]">
          {/* Logo - Extreme Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">DataInsight</span>
            </Link>
          </div>

          {/* Navigation - Center */}
          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-1">
              {/* Products Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setProductsDropdownOpen(true)}
                onMouseLeave={() => setProductsDropdownOpen(false)}
              >
                <button className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200">
                  Products
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${productsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {productsDropdownOpen && (
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 pt-3"
                    onMouseEnter={() => setProductsDropdownOpen(true)}
                    onMouseLeave={() => setProductsDropdownOpen(false)}
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 w-[700px]">
                      {/* Featured Section */}
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <p className="text-xs font-bold text-gray-500 mb-3 tracking-wider">FEATURED</p>
                        {productItems.filter(item => item.category === 'FEATURED').map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-start p-4 rounded-xl hover:bg-blue-50 transition-colors group"
                          >
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                              {item.icon}
                            </div>
                            <div className="ml-4">
                              <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      
                      {/* Explore Section */}
                      <div>
                        <p className="text-xs font-bold text-gray-500 mb-4 tracking-wider">EXPLORE GOODDATA</p>
                        <div className="grid grid-cols-2 gap-3">
                          {productItems.filter(item => item.category === 'EXPLORE GOODDATA').map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                            >
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
                                {item.icon}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</p>
                                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing Link */}
              <Link
                to="/pricing"
                className={`px-4 py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === '/pricing' ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Pricing
              </Link>

              {/* Resources Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setResourcesDropdownOpen(true)}
                onMouseLeave={() => setResourcesDropdownOpen(false)}
              >
                <button className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200">
                  Resources
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${resourcesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {resourcesDropdownOpen && (
                  <div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 pt-2"
                    onMouseEnter={() => setResourcesDropdownOpen(true)}
                    onMouseLeave={() => setResourcesDropdownOpen(false)}
                  >
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-6 w-[600px]">
                      <div className="grid grid-cols-2 gap-4">
                        {resourceItems.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-200 transition-colors">
                              {item.icon}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">{item.name}</p>
                              <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions - Extreme Right */}
          <div className="flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
            <Link 
              to="/login" 
              className="hidden lg:inline-flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 whitespace-nowrap"
            >
              Sign in
            </Link>
            <button
              onClick={onDemoClick}
              className="hidden lg:inline-flex items-center px-5 py-2.5 text-base font-semibold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 whitespace-nowrap"
            >
              Request Demo
            </button>
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden bg-white p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>

      </nav>
    </header>
    
    {/* Mobile menu - Outside header for proper z-index */}
    {mobileMenuOpen && (
      <div
        className="lg:hidden bg-white fixed inset-0 overflow-y-auto"
        style={{ zIndex: 99999 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-2xl font-bold text-blue-600">DataInsight</span>
          <button
            type="button"
            className="bg-white rounded-md p-2 text-gray-400 hover:text-gray-500"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 pt-2 pb-3 space-y-1">
          {mobileNavigation.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                {item.icon && (
                  <div className="mr-3 text-blue-600">
                    {item.icon}
                  </div>
                )}
                <div>
                  <div className="font-semibold">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500">{item.description}</div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="px-4 py-4 border-t border-gray-200">
          <Link
            to="/login"
            className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 mb-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign in
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onDemoClick();
            }}
            className="block w-full text-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Request Demo
          </button>
        </div>
      </div>
    )}
    </>
  );
};

export default Header;
