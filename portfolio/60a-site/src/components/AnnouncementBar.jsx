import React, { useState } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnnouncementBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex-1 flex items-center justify-center space-x-3">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <p className="text-sm font-medium">
              <span className="hidden sm:inline">🎉 Webinar: AI in History, November 12 </span>
              <Link 
                to="/contact" 
                className="font-bold underline hover:text-blue-100 transition-colors ml-2"
              >
                Register now →
              </Link>
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Close announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
