import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

const Hero = ({ onDemoClick }) => {
  return (
    <>
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen flex items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm font-medium mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
            Trusted by 5000+ companies worldwide
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Transform Your Data
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Into Intelligence
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            The most advanced AI-powered analytics platform that turns complex data into actionable insights.
            Start your transformation today.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={onDemoClick}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const featuresSection = document.getElementById('features');
                if (featuresSection) {
                  featuresSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white text-lg font-semibold rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Trusted Brands Section - Separate from gradient */}
    <section className="bg-white py-12 md:py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <p className="text-gray-600 text-sm md:text-base font-medium mb-2">Trusted by 5000+ companies worldwide</p>
        </motion.div>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {/* First set of logos */}
            <div className="flex items-center space-x-8 md:space-x-12 px-4 md:px-6">
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Microsoft</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Google</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Amazon</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Meta</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Apple</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Netflix</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Tesla</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Uber</span>
              </div>
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center space-x-8 md:space-x-12 px-4 md:px-6">
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Microsoft</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Google</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Amazon</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Meta</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Apple</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Netflix</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Tesla</span>
              </div>
              <div className="flex items-center justify-center min-w-[120px] md:min-w-[140px] h-12 md:h-14 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 md:px-6 transition-colors">
                <span className="text-gray-700 font-semibold text-base md:text-lg">Uber</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default Hero;
