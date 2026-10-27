import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, DollarSign, FileText, Users, Briefcase, Mail, Scale, Map, Package } from 'lucide-react';

const Sitemap = () => {
  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: <Home className="h-5 w-5" />,
      links: [
        { name: 'Home', path: '/', description: 'Welcome to DataInsight' },
        { name: 'Features', path: '/#features', description: 'Explore our powerful features' },
        { name: 'Pricing', path: '/pricing', description: 'View our pricing plans' },
      ]
    },
    {
      title: 'Resources',
      icon: <FileText className="h-5 w-5" />,
      links: [
        { name: 'Blog', path: '/blog', description: 'Latest insights and articles' },
        { name: 'About Us', path: '/about', description: 'Learn about our company' },
        { name: 'Partners', path: '/partners', description: 'Our trusted partners' },
      ]
    },
    {
      title: 'Company',
      icon: <Users className="h-5 w-5" />,
      links: [
        { name: 'Careers', path: '/careers', description: 'Join our team' },
        { name: 'Contact Us', path: '/contact', description: 'Get in touch with us' },
      ]
    },
    {
      title: 'Legal',
      icon: <Scale className="h-5 w-5" />,
      links: [
        { name: 'Terms & Conditions', path: '/terms', description: 'Our terms of service' },
        { name: 'Privacy Policy', path: '/privacy', description: 'How we protect your data' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <Map className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sitemap</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Navigate through all pages and sections of DataInsight
            </p>
          </motion.div>
        </div>
      </div>

      {/* Sitemap Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sitemapSections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mr-4">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    to={link.path}
                    className="block p-4 rounded-xl hover:bg-blue-50 transition-colors group"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {link.name}
                    </h3>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Use our search feature or contact our support team for assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              Contact Support
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border-2 border-white/30"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sitemap;
