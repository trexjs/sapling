import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Shield, Zap, ArrowRight, Users, Database, Clock, Award, X, Play } from 'lucide-react';

const Features = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Advanced Analytics',
      description: 'Transform raw data into actionable insights with our AI-powered analytics engine.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption and compliance certifications.'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Process millions of data points in seconds with our optimized infrastructure.'
    }
  ];

  const stats = [
    {
      icon: <Database className="h-6 w-6" />,
      value: '10B+',
      label: 'Data Points Processed',
      description: 'Every day'
    },
    {
      icon: <Users className="h-6 w-6" />,
      value: '5000+',
      label: 'Happy Customers',
      description: 'Worldwide'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      value: '99.9%',
      label: 'Uptime SLA',
      description: 'Guaranteed'
    },
    {
      icon: <Award className="h-6 w-6" />,
      value: '24/7',
      label: 'Expert Support',
      description: 'Always available'
    }
  ];

  return (
    <>
      <section id="features" className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Statistics Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Trusted by Industry Leaders
              </h2>
              <p className="text-lg text-gray-600">
                Join thousands of companies already transforming their data into decisions
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/50 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <div className="text-blue-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-gray-800 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple 4-step process. No complex setup required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Data',
                description: 'Link your databases, APIs, and data sources in seconds',
                icon: '🔗'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI automatically discovers patterns and insights',
                icon: '🤖'
              },
              {
                step: '03',
                title: 'Get Insights',
                description: 'Receive actionable recommendations and visualizations',
                icon: '📊'
              },
              {
                step: '04',
                title: 'Take Action',
                description: 'Implement insights to drive better business decisions',
                icon: '⚡'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold rounded-full mb-6 shadow-lg">
                  {step.step}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                {(index + 1) < 3 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 transform translate-x-8 -translate-y-2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Businesses
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to turn data into decisions. Built for scale, designed for simplicity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                <div className="text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Video Demo Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See DataInsight in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Watch how leading companies transform their data into actionable insights
            </p>
          </div>

          <div 
            className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video max-w-5xl mx-auto cursor-pointer group"
            onClick={() => setIsVideoModalOpen(true)}
          >
            {/* Preview Image */}
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80" 
              alt="Video Preview"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-purple-900/60 group-hover:from-blue-900/70 group-hover:to-purple-900/70 transition-all duration-300"></div>
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/40 transition-all duration-300 animate-pulse"></div>
                <div className="relative flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-10 w-10 text-blue-600 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>
            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white text-lg font-semibold">2-Minute Product Demo</p>
              <p className="text-white/80 text-sm">Learn how to get started with DataInsight</p>
            </div>
          </div>
        </motion.div>

        {/* Industry Use Cases */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted Across Industries
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From startups to enterprises, companies across sectors rely on DataInsight
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                industry: 'E-commerce',
                icon: '🛒',
                description: 'Optimize inventory and boost sales with predictive analytics',
                metric: '+45% Revenue Growth'
              },
              {
                industry: 'Finance',
                icon: '💰',
                description: 'Detect fraud and manage risk with real-time insights',
                metric: '99.8% Accuracy'
              },
              {
                industry: 'Healthcare',
                icon: '🏥',
                description: 'Improve patient outcomes with data-driven decisions',
                metric: '30% Cost Reduction'
              },
              {
                industry: 'Manufacturing',
                icon: '🏭',
                description: 'Streamline operations and reduce downtime',
                metric: '60% Less Downtime'
              }
            ].map((useCase, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-5xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {useCase.industry}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {useCase.description}
                </p>
                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                  {useCase.metric}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from companies transforming their business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'CEO, TechCorp',
                company: 'TechCorp',
                image: '👩‍💼',
                quote: 'DataInsight transformed how we make decisions. The AI-powered insights saved us millions in operational costs.',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'CTO, InnovateLabs',
                company: 'InnovateLabs',
                image: '👨‍💻',
                quote: 'The best analytics platform we\'ve used. Implementation was seamless and ROI was immediate.',
                rating: 5
              },
              {
                name: 'Emily Rodriguez',
                role: 'VP of Analytics, DataFlow',
                company: 'DataFlow',
                image: '👩‍🔬',
                quote: 'Game-changer for our team. The real-time dashboards and predictive models are incredibly accurate.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{testimonial.image}</div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600 font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Blog Preview Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Latest Insights
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest trends in data analytics and business intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'The Future of AI in Business Analytics',
                excerpt: 'Discover how artificial intelligence is revolutionizing data analysis and decision-making processes.',
                category: 'AI & ML',
                date: 'Nov 1, 2024',
                readTime: '5 min read',
                image: '🤖'
              },
              {
                title: '10 Data Visualization Best Practices',
                excerpt: 'Learn how to create compelling visualizations that tell your data story effectively.',
                category: 'Best Practices',
                date: 'Oct 28, 2024',
                readTime: '7 min read',
                image: '📊'
              },
              {
                title: 'Building a Data-Driven Culture',
                excerpt: 'Transform your organization with strategies for fostering data-driven decision making.',
                category: 'Strategy',
                date: 'Oct 25, 2024',
                readTime: '6 min read',
                image: '🎯'
              }
            ].map((post, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-6xl">
                  {post.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold mr-3">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/blog" className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Ready to get started?
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Join thousands of companies already using our platform to make better decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white text-2xl font-bold mb-4">
                99.9%
              </div>
              <p className="text-gray-600 font-medium">Uptime SLA</p>
            </div>
          </div>
        </motion.div>
      </div>

    </section>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
              >
                <X className="h-6 w-6 text-white" />
              </button>

              {/* Video Player */}
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="DataInsight Product Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Features;
