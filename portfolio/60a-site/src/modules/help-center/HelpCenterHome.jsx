import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Package, Truck, Users, ShoppingCart } from 'lucide-react';

const HelpCenterHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const categories = [
    {
      title: 'Getting Started',
      count: 7,
      articles: [
        { id: 1, title: 'How do I sign up for a Shiprocket account?', icon: '📝' },
        { id: 2, title: 'What is Shiprocket and how does it work?', icon: '📝' },
        { id: 3, title: 'Important Terms All Shiprocket Users Should...', icon: '📝' },
        { id: 4, title: 'Shiprocket: 3 Tips for Taking Better Shipmen...', icon: '📝' },
        { id: 5, title: 'Learn More About Your Home Page', icon: '📝' },
      ]
    },
    {
      title: 'Orders',
      sections: [
        {
          subtitle: 'New Order',
          count: 16,
          articles: [
            { id: 6, title: 'How to Create an Order in Shiprocket?', icon: '📝' }
          ]
        },
        {
          subtitle: 'Process Order',
          count: 136,
          articles: [
            { id: 7, title: 'How do I ship an order with Shiprocket?', icon: '📝' }
          ]
        }
      ]
    },
    {
      title: 'Setup & Manage',
      sections: [
        {
          subtitle: 'Channels',
          count: 22,
          articles: [
            { id: 8, title: 'How do I Integrate Amazon as a channel?', icon: '📝' },
            { id: 9, title: 'How Do I Integrate WooCommerce with Shp...', icon: '📝' },
            { id: 10, title: 'How do I Integrate Shopify as a channel with...', icon: '📝' },
            { id: 11, title: 'How do I Integrate unicommerce with Shipr...', icon: '📝' },
            { id: 12, title: 'What is a Pull Order Status Mapper?', icon: '📝' },
          ]
        },
        {
          subtitle: 'Catalogue',
          count: 8,
          articles: [
            { id: 13, title: 'How to Import your master catalog to Shipro...', icon: '📝' },
            { id: 14, title: 'How do I link my sales channel catalog to m...', icon: '📝' },
            { id: 15, title: 'Can I Create an Order Without Adding Produ...', icon: '📝' },
          ]
        }
      ]
    },
    {
      title: 'Courier',
      count: 7,
      articles: [
        { id: 16, title: 'How to set courier priority?', icon: '📝' },
        { id: 17, title: 'How to block and unblock DDA and RTO shi...', icon: '📝' },
        { id: 18, title: 'How to set Courier Rules?', icon: '📝' },
        { id: 19, title: 'How to Activate or Deactivate Couriers?', icon: '📝' },
        { id: 20, title: 'What if no courier rule is applicable?', icon: '📝' },
      ]
    },
    {
      title: 'Packaging',
      count: 6,
      articles: [
        { id: 21, title: 'What kind of packaging is available with Shi...', icon: '📝' },
        { id: 22, title: 'Can I use my packaging?', icon: '📝' },
        { id: 23, title: 'I want to add or modify my packaging. How ...', icon: '📝' },
        { id: 24, title: 'Will you charge me for packaging if my order...', icon: '📝' },
        { id: 25, title: 'I want to check what packaging you used for...', icon: '📝' },
      ]
    },
    {
      title: 'Customers',
      count: 3,
      articles: [
        { id: 26, title: 'How to add and search your customer\'s deta...', icon: '📝' },
        { id: 27, title: 'What are the benefits of saving Customer det...', icon: '📝' },
        { id: 28, title: 'What Customer Insights Can You Gain From S...', icon: '📝' },
      ]
    },
    {
      title: 'Brand Boost',
      count: 6,
      articles: [
        { id: 29, title: 'What is Shiprocket Brand Boost?', icon: '📝' },
        { id: 30, title: 'What are the benefits of using Shiprocket Br...', icon: '📝' },
      ]
    },
    {
      title: 'Buyer Communication',
      count: 12,
      articles: [
        { id: 31, title: 'What are Buyer Communication Settings?', icon: '📝' },
        { id: 32, title: 'How to customize my email notifications?', icon: '📝' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
            <nav className="flex gap-6">
              <Link to="/help-center" className="text-indigo-600 font-medium border-b-2 border-indigo-600 pb-4">
                Home
              </Link>
              <Link to="/" className="text-gray-600 hover:text-gray-900 pb-4">
                Back to Site
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900 text-center mb-8">
            How can we help you today?
          </h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter your search term here..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          {!isLoggedIn ? (
            <>
              <div className="mt-6 flex items-center gap-4">
                <Link to="/support/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                  Login
                </Link>
                <span className="text-gray-600">to submit a new ticket</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <Link to="/tickets" className="text-indigo-600 hover:text-indigo-700">
                  Check Ticket Status
                </Link>
              </div>
            </>
          ) : (
            <div className="mt-6 flex items-center gap-4">
              <Link 
                to="/tickets/create" 
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Create New Ticket
              </Link>
              <Link to="/tickets" className="text-indigo-600 hover:text-indigo-700 font-medium">
                View My Tickets
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Knowledge base</h2>
            <Link to="/help-center" className="text-indigo-600 hover:text-indigo-700">
              Home
            </Link>
          </div>

          {/* Categories Grid */}
          <div className="space-y-8">
            {categories.map((category, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-8 last:border-b-0">
                {!category.sections ? (
                  // Simple category
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {category.title} {category.count && <span className="text-gray-500">({category.count})</span>}
                    </h3>
                    <ul className="space-y-3">
                      {category.articles.map((article) => (
                        <li key={article.id}>
                          <Link
                            to={`/help-center/article/${article.id}`}
                            className="flex items-start gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
                          >
                            <span className="text-lg">{article.icon}</span>
                            <span>{article.title}</span>
                          </Link>
                        </li>
                      ))}
                      {category.articles.length >= 5 && (
                        <li>
                          <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                            View all {category.count} →
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  // Category with sections
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">{category.title}</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      {category.sections.map((section, sIdx) => (
                        <div key={sIdx}>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            {section.subtitle} <span className="text-gray-500">({section.count})</span>
                          </h4>
                          <ul className="space-y-2">
                            {section.articles.map((article) => (
                              <li key={article.id}>
                                <Link
                                  to={`/help-center/article/${article.id}`}
                                  className="flex items-start gap-2 text-gray-700 hover:text-indigo-600 transition-colors text-sm"
                                >
                                  <span>{article.icon}</span>
                                  <span>{article.title}</span>
                                </Link>
                              </li>
                            ))}
                            {section.articles.length >= 3 && (
                              <li>
                                <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                                  View all {section.count} →
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterHome;
