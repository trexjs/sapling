import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, BarChart2, Zap, Shield, Globe, Target, Linkedin, Award, Handshake } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Customers', value: '5000+', icon: <Users size={24} className="text-blue-600" /> },
    { label: 'Data Points Analyzed', value: '10B+', icon: <BarChart2 size={24} className="text-blue-600" /> },
    { label: 'Uptime', value: '99.99%', icon: <Zap size={24} className="text-blue-600" /> },
    { label: 'Security', value: 'Enterprise-Grade', icon: <Shield size={24} className="text-blue-600" /> },
  ];

  const values = [
    {
      name: 'Customer First',
      description: 'We prioritize our customers in every decision we make, ensuring their success is our success.',
      icon: <Users size={24} className="text-blue-600" />
    },
    {
      name: 'Innovation',
      description: 'We embrace change and constantly seek new ways to solve complex problems.',
      icon: <Zap size={24} className="text-blue-600" />
    },
    {
      name: 'Integrity',
      description: 'We conduct our business with honesty, transparency, and the highest ethical standards.',
      icon: <Shield size={24} className="text-blue-600" />
    },
    {
      name: 'Global Impact',
      description: 'We build solutions that make a difference on a global scale.',
      icon: <Globe size={24} className="text-blue-600" />
    },
    {
      name: 'Excellence',
      description: 'We strive for excellence in everything we do, setting high standards for ourselves.',
      icon: <Target size={24} className="text-blue-600" />
    },
  ];

  const [activeTab, setActiveTab] = useState('management');

  const leadership = {
    management: [
      {
        name: 'Sarah Johnson',
        role: 'Chief Executive Officer',
        bio: 'Former VP at Microsoft, leading DataInsight with 20+ years of tech industry experience.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        linkedin: '#'
      },
      {
        name: 'Michael Chen',
        role: 'Chief Technology Officer',
        bio: 'AI and ML expert with PhD from MIT, pioneering next-gen analytics solutions.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        linkedin: '#'
      },
      {
        name: 'Emily Rodriguez',
        role: 'Chief Operating Officer',
        bio: 'Operations leader with proven track record at Fortune 500 companies.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        linkedin: '#'
      },
      {
        name: 'David Park',
        role: 'Chief Financial Officer',
        bio: 'Finance executive with expertise in scaling SaaS businesses globally.',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        linkedin: '#'
      }
    ],
    board: [
      {
        name: 'Robert Williams',
        role: 'Board Chairman',
        bio: 'Serial entrepreneur and investor with 5 successful exits.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        linkedin: '#'
      },
      {
        name: 'Jennifer Lee',
        role: 'Board Member',
        bio: 'Former Google executive and venture capital partner.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        linkedin: '#'
      },
      {
        name: 'James Anderson',
        role: 'Board Member',
        bio: 'Technology strategist and advisor to Fortune 100 companies.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
        linkedin: '#'
      }
    ]
  };

  const partners = [
    { name: 'Amazon Web Services', logo: 'AWS' },
    { name: 'Microsoft Azure', logo: 'Azure' },
    { name: 'Google Cloud', logo: 'GCP' },
    { name: 'Snowflake', logo: 'Snowflake' },
    { name: 'Databricks', logo: 'Databricks' },
    { name: 'Tableau', logo: 'Tableau' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="relative z-10">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              About DataInsight
            </motion.h1>
            <motion.p 
              className="text-xl max-w-3xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Empowering businesses with actionable insights through AI-powered analytics. We help companies make data-driven decisions that drive growth and innovation.
            </motion.p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-50"></div>
      </div>

      {/* Stats */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="text-center p-6 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <motion.div 
              className="mb-12 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2020, DataInsight was born from a simple idea: make powerful data analytics accessible to businesses of all sizes. 
                  Our team of data scientists, engineers, and business experts came together with a shared vision to democratize data.
                </p>
                <p>
                  Today, we serve thousands of customers worldwide, from startups to Fortune 500 companies, helping them unlock the full potential of their data.
                </p>
                <p>
                  Our mission is to empower organizations with the tools and insights they need to make better decisions, faster.
                </p>
              </div>
            </motion.div>
            <motion.div
              className="bg-gray-200 rounded-lg overflow-hidden h-96"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" 
                alt="Our team"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at DataInsight
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div 
                key={value.name}
                className="p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{value.name}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Leadership
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet the experienced team driving innovation and excellence at DataInsight
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveTab('management')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'management'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Management Team
            </button>
            <button
              onClick={() => setActiveTab('board')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'board'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Board of Directors
            </button>
          </div>
        </div>

        {/* Leadership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leadership[activeTab].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-blue-600 font-semibold mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                <a
                  href={member.linkedin}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Linkedin className="h-5 w-5 mr-2" />
                  <span className="text-sm font-semibold">Connect</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
              <Handshake className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Strategic Partners
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
              We collaborate with industry leaders to deliver exceptional solutions
            </p>
            <Link
              to="/partners"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
            >
              View all partners →
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex items-center justify-center hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-bold text-blue-600">{partner.logo.slice(0, 2)}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">{partner.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-blue-100">Start your free trial today.</span>
            </h2>
          </motion.div>
          <motion.div 
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 bg-opacity-60 hover:bg-opacity-70"
              >
                Contact sales
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
