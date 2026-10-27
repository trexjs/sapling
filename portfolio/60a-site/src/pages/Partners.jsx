import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Handshake, Award, Globe, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';

const Partners = () => {
  const partnerCategories = [
    {
      title: 'Technology Partners',
      description: 'Leading technology companies that integrate with DataInsight',
      icon: <Globe className="h-6 w-6" />,
      partners: [
        { name: 'Amazon Web Services', logo: 'AWS', tier: 'Platinum', description: 'Cloud infrastructure partner' },
        { name: 'Microsoft Azure', logo: 'Azure', tier: 'Platinum', description: 'Enterprise cloud solutions' },
        { name: 'Google Cloud', logo: 'GCP', tier: 'Platinum', description: 'Data analytics platform' },
        { name: 'Snowflake', logo: 'Snowflake', tier: 'Gold', description: 'Data warehouse integration' },
        { name: 'Databricks', logo: 'Databricks', tier: 'Gold', description: 'Unified analytics platform' },
        { name: 'Tableau', logo: 'Tableau', tier: 'Gold', description: 'Data visualization partner' },
      ]
    },
    {
      title: 'Solution Partners',
      description: 'Consulting and implementation partners',
      icon: <Users className="h-6 w-6" />,
      partners: [
        { name: 'Accenture', logo: 'Accenture', tier: 'Elite', description: 'Global consulting partner' },
        { name: 'Deloitte', logo: 'Deloitte', tier: 'Elite', description: 'Digital transformation' },
        { name: 'PwC', logo: 'PwC', tier: 'Premier', description: 'Business intelligence consulting' },
        { name: 'KPMG', logo: 'KPMG', tier: 'Premier', description: 'Data analytics services' },
      ]
    },
    {
      title: 'Reseller Partners',
      description: 'Authorized resellers and distributors',
      icon: <TrendingUp className="h-6 w-6" />,
      partners: [
        { name: 'Tech Data', logo: 'TechData', tier: 'Authorized', description: 'Global distributor' },
        { name: 'Ingram Micro', logo: 'Ingram', tier: 'Authorized', description: 'Technology solutions' },
        { name: 'SHI International', logo: 'SHI', tier: 'Authorized', description: 'IT solutions provider' },
      ]
    }
  ];

  const benefits = [
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Co-Marketing Opportunities',
      description: 'Joint marketing campaigns and events to reach new customers'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Dedicated Support',
      description: 'Priority technical support and partner success managers'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Revenue Growth',
      description: 'Competitive margins and incentive programs'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Global Network',
      description: 'Access to our worldwide partner ecosystem'
    }
  ];

  const tierBadgeColor = (tier) => {
    switch(tier) {
      case 'Platinum':
      case 'Elite':
        return 'bg-gradient-to-r from-purple-500 to-purple-700 text-white';
      case 'Gold':
      case 'Premier':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

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
              <Handshake className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partners</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Together, we're transforming how businesses leverage data. Join our global partner ecosystem.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Become a Partner
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'Global Partners' },
            { value: '150+', label: 'Countries' },
            { value: '95%', label: 'Partner Satisfaction' },
            { value: '$2B+', label: 'Partner Revenue' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center"
            >
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Partner Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {partnerCategories.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mr-4">
                {category.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{category.title}</h2>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.partners.map((partner, partnerIndex) => (
                <motion.div
                  key={partnerIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: partnerIndex * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">{partner.logo.slice(0, 2)}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tierBadgeColor(partner.tier)}`}>
                      {partner.tier}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-gray-600">{partner.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Partner Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our partner program and unlock exclusive benefits designed to help you succeed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl text-blue-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Partner with Us?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let's work together to deliver exceptional data solutions to customers worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border-2 border-white/30"
            >
              Contact Partner Team
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Partners;
