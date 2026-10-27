import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock, Zap, Users, Award, Heart, ArrowRight } from 'lucide-react';

const Careers = () => {
  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      type: 'Full-time',
      location: 'Remote',
      department: 'Engineering',
      description: 'We are looking for an experienced Frontend Developer to join our growing team.'
    },
    {
      id: 2,
      title: 'Data Scientist',
      type: 'Full-time',
      location: 'San Francisco, CA',
      department: 'Data Science',
      description: 'Join our data science team to build cutting-edge analytics solutions.'
    },
    {
      id: 3,
      title: 'Product Manager',
      type: 'Full-time',
      location: 'New York, NY',
      department: 'Product',
      description: 'Lead product development and strategy for our analytics platform.'
    },
  ];

  const benefits = [
    { icon: <DollarSign size={20} />, title: 'Competitive Salary', description: 'We offer industry-leading compensation packages.' },
    { icon: <Clock size={20} />, title: 'Flexible Hours', description: 'Work when you are most productive.' },
    { icon: <Zap size={20} />, title: 'Learning Budget', description: 'Annual stipend for professional development.' },
    { icon: <Users size={20} />, title: 'Team Events', description: 'Regular team outings and activities.' },
    { icon: <Award size={20} />, title: 'Career Growth', description: 'Clear paths for advancement and promotion.' },
    { icon: <Heart size={20} />, title: 'Health & Wellness', description: 'Comprehensive health benefits for you and your family.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join Our Team
          </motion.h1>
          <motion.p
            className="text-xl text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Help us build the future of data analytics. Work with talented people on meaningful projects.
          </motion.p>
        </div>
      </div>

      {/* Job Openings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Current Openings</h2>
        <div className="grid gap-6 max-w-4xl mx-auto">
          {jobOpenings.map((job, index) => (
            <motion.div
              key={job.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0 flex-1">
                  <Link to={`/careers/${job.id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {job.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-3 mb-2">
                    <span className="flex items-center text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 mr-1" /> {job.type}
                    </span>
                    <span className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" /> {job.location}
                    </span>
                  </div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                    {job.department}
                  </span>
                </div>
                <Link
                  to={`/careers/${job.id}`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Benefits</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">We take care of our team with industry-leading benefits and perks.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-blue-600 mb-3">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Culture CTA */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Culture</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            We believe in transparency, collaboration, and continuous learning. Our culture is built on trust, respect, and the pursuit of excellence.
          </p>
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Learn More About Our Culture
          </button>
        </div>
      </div>
    </div>
  );
};

export default Careers;
