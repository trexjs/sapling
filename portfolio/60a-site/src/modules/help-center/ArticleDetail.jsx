import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Package, ChevronRight, Printer, ThumbsUp, ThumbsDown, Phone } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackData, setCallbackData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    city: '',
    state: '',
    country: ''
  });

  // Mock article data
  const article = {
    id: id,
    title: 'How do I sign up for a Shiprocket account?',
    category: 'Getting Started',
    modifiedDate: 'Thu 7 Nov, 2024 at 1:03 PM',
    content: `
      <h3>Signing up for a Shiprocket Account: A Simplified Guide</h3>
      <p>Here's a breakdown of how to create your Shiprocket account in just a few easy steps:</p>
      
      <ol>
        <li><strong>Head to Our Website:</strong> Visit our official website at <a href="https://www.shiprocket.in" target="_blank">https://www.shiprocket.in</a></li>
        <li><strong>Click "Sign Up for Free":</strong> Look for the button, usually positioned in the center of the homepage (To) or free signup, inviting new users to join.</li>
      </ol>
      
      <div class="screenshot-container">
        <img src="/api/placeholder/600/400" alt="Shiprocket Signup Screenshot" />
      </div>
      
      <h4>That's it. Now you can proceed towards KYC and Other Settings.</h4>
      
      <div class="video-container">
        <h4>4. Watch This Video:</h4>
        <p>For a visual guide, check out this helpful video tutorial:</p>
        <div class="video-placeholder">
          <div class="play-button">▶</div>
          <p>Video Tutorial: How to Sign Up</p>
        </div>
      </div>
    `,
    relatedArticles: [
      { id: 2, title: 'How can users register on myShiprocket?' },
      { id: 3, title: 'How can users access myShiprocket once re...' },
      { id: 4, title: 'Why do I need to add my bank account deta...' },
      { id: 5, title: 'How do I handle pickup delays in my Shipro...' },
      { id: 6, title: 'Shiprocket Workspace App Help Document' },
      { id: 7, title: 'Shiprocket App: When will I receive my COD...' },
      { id: 8, title: 'What is Shippo bot Early ON should I opt f...' },
      { id: 9, title: 'How do I integrate Ecwid as a channel with...' },
      { id: 10, title: 'How to set courier priority?' },
      { id: 11, title: 'How do I recharge my Shiprocket wallet?' }
    ]
  };

  const handleFeedback = (isHelpful) => {
    setFeedback(isHelpful);
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    console.log('Callback request submitted:', callbackData);
    alert('Callback request submitted successfully!');
    setShowCallbackForm(false);
  };

  const handleCallbackChange = (e) => {
    setCallbackData({
      ...callbackData,
      [e.target.name]: e.target.value
    });
  };

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
              <Link to="/help-center/solutions" className="text-gray-600 hover:text-gray-900 pb-4">
                Solutions
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <input
            type="text"
            placeholder="Enter your search term here..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <Link to="/help-center" className="text-indigo-600 hover:text-indigo-700">
                  Solution home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link to="/help-center" className="text-indigo-600 hover:text-indigo-700">
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span>{article.category}</span>
              </div>

              {/* Article Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Modified on: {article.modifiedDate}
                  </p>
                </div>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                  <Printer className="w-5 h-5" />
                  <span>Print</span>
                </button>
              </div>

              {/* Article Content */}
              <div 
                className="prose max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Feedback Section */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-gray-900 font-medium mb-4">Did you find it helpful?</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleFeedback(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      feedback === true
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span>Yes</span>
                  </button>
                  <button
                    onClick={() => handleFeedback(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                      feedback === false
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                    <span>No</span>
                  </button>
                </div>
                {feedback !== null && (
                  <p className="mt-4 text-sm text-gray-600">
                    {feedback ? 'Thank you for your feedback!' : 'We\'re sorry this wasn\'t helpful. Please let us know how we can improve.'}
                  </p>
                )}
              </div>

              {/* Request Callback Button */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => setShowCallbackForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>Request a Call Back</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Articles */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
              <ul className="space-y-3">
                {article.relatedArticles.map((related) => (
                  <li key={related.id}>
                    <Link
                      to={`/help-center/article/${related.id}`}
                      className="flex items-start gap-2 text-sm text-gray-700 hover:text-indigo-600 transition-colors"
                    >
                      <span className="text-indigo-600 mt-0.5">📄</span>
                      <span>{related.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* RCB Modal Popup */}
      {showCallbackForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Request a Call Back</h3>
              <button
                onClick={() => setShowCallbackForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCallbackSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add your Complete Address
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  We will be triggering a callback, if you have not activated any
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={callbackData.addressLine1}
                  onChange={handleCallbackChange}
                  placeholder="Residential"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={callbackData.addressLine2}
                  onChange={handleCallbackChange}
                  placeholder="Residential"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={callbackData.pincode}
                    onChange={handleCallbackChange}
                    placeholder="400001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={callbackData.city}
                    onChange={handleCallbackChange}
                    placeholder="Gujarat"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={callbackData.state}
                    onChange={handleCallbackChange}
                    placeholder="Maharashtra"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={callbackData.country}
                    onChange={handleCallbackChange}
                    placeholder="India"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Why we need this info?</strong><br />
                  This address will be used to give shipping address in signup form. It saves a lot of time.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white font-medium py-2.5 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setShowCallbackForm(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;
