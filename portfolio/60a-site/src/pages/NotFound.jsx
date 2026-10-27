import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, FileQuestion, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1
          }}
        >
          <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            404
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          {/* Search Box */}
          <div className="mb-8">
            <div className="relative max-w-sm mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search our site..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </button>
          </div>

          {/* Popular Pages */}
          <motion.div
            className="mt-12 pt-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                Home
              </Link>
              <Link to="/pricing" className="text-blue-600 hover:text-blue-800 transition-colors">
                Pricing
              </Link>
              <Link to="/blog" className="text-blue-600 hover:text-blue-800 transition-colors">
                Blog
              </Link>
              <Link to="/about" className="text-blue-600 hover:text-blue-800 transition-colors">
                About
              </Link>
              <Link to="/careers" className="text-blue-600 hover:text-blue-800 transition-colors">
                Careers
              </Link>
              <a href="#contact" className="text-blue-600 hover:text-blue-800 transition-colors">
                Contact
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
