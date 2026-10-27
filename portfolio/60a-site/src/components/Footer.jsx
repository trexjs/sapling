import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Mail, Facebook, Youtube, BarChart3 } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigation = {
    product: [
      { name: 'Product Overview', href: '/#features' },
      { name: 'Business Intelligence', href: '/#features' },
      { name: 'Analytics Lake', href: '/#features' },
      { name: 'AI Assistant', href: '/#features' },
      { name: 'Analytics as Code', href: '/#features' },
      { name: 'Headless BI', href: '/#features' },
      { name: 'Embedded Analytics', href: '/#features' },
      { name: 'Data Visualization', href: '/#features' },
      { name: 'Data Monetization', href: '/#features' },
      { name: 'Query Acceleration', href: '/#features' },
      { name: 'Security & Compliance', href: '/#features' },
      { name: 'Data Automation', href: '/#features' },
    ],
    solutions: [
      { name: 'Solutions Hub', href: '#' },
      { name: 'Professional Services', href: '#' },
      { name: 'Software', href: '#' },
      { name: 'Healthcare', href: '#' },
      { name: 'E-commerce', href: '#' },
      { name: 'Finance', href: '#' },
      { name: 'Insurance', href: '#' },
      { name: 'Real estate', href: '#' },
      { name: 'Pharma', href: '#' },
      { name: 'Restaurants', href: '#' },
      { name: 'SaaS', href: '#' },
      { name: 'Hospitality', href: '#' },
    ],
    developers: [
      { name: 'Python SDK', href: '#' },
      { name: 'React SDK', href: '#' },
      { name: 'Examples Gallery', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Release Notes', href: '#' },
    ],
    resources: [
      { name: 'Sitemap', href: '/sitemap' },
      { name: 'Product tours', href: '#' },
      { name: 'Case Studies', href: '#' },
      { name: 'Whitepapers', href: '#' },
      { name: 'Events', href: '#' },
      { name: 'Blog', href: '/blog' },
      { name: 'Videos', href: '#' },
      { name: 'Webinars', href: '#' },
      { name: 'Analyst Reports', href: '#' },
      { name: 'E-books', href: '#' },
    ],
    learn: [
      { name: 'Documentation', href: '#' },
      { name: 'University', href: '#' },
      { name: 'Slack', href: '#' },
      { name: 'Certification Program', href: '#' },
    ],
    company: [
      { name: 'Company', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Customers', href: '#' },
      { name: 'Partners', href: '/partners' },
      { name: 'Careers', href: '/careers' },
      { name: 'Help Center', href: '/help-center' },
      { name: 'Brand/Newsroom', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Legal', href: '/terms' },
      { name: 'Support Policy', href: '#' },
    ],
    social: [
      { name: 'LinkedIn', href: '#', icon: Linkedin },
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'Facebook', href: '#', icon: Facebook },
      { name: 'Youtube', href: '#', icon: Youtube },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Start with DataInsight</h3>
              <p className="text-blue-100">Transform your data into actionable insights today</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg text-center"
              >
                Request a demo
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border-2 border-white/30 text-center"
              >
                Try it now
              </Link>
              <Link
                to="/pricing"
                className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border-2 border-white/30 text-center"
              >
                See pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Product */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Product</h3>
            <ul className="space-y-2.5">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Solutions</h3>
            <ul className="space-y-2.5">
              {navigation.solutions.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Developers</h3>
            <ul className="space-y-2.5">
              {navigation.developers.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {navigation.resources.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">Learn</h3>
            <ul className="space-y-2.5">
              {navigation.learn.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About DataInsight */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4">About DataInsight</h3>
            <ul className="space-y-2.5">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">DataInsight</span>
              </Link>
              <div className="text-xs text-gray-500">
                <p>Copyright © 2007 - {currentYear} DataInsight Corporation. All Rights Reserved</p>
              </div>
            </div>

            {/* Social and Language */}
            <div className="flex items-center space-x-6">
              {/* Social Icons */}
              <div className="flex space-x-3">
                {navigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>

              {/* Language Selector */}
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <span className="text-sm text-gray-300">🌐 English (US)</span>
              </button>
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
            {navigation.legal.map((item, index) => (
              <React.Fragment key={item.name}>
                <Link to={item.href} className="hover:text-white transition-colors">
                  {item.name}
                </Link>
                {index < navigation.legal.length - 1 && <span>|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
