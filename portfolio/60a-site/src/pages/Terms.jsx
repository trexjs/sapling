import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertCircle, Scale } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: '1. Acceptance of Terms',
      content: 'By accessing and using DataInsight\'s services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: '2. Use of Services',
      content: 'You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: '3. Intellectual Property',
      content: 'All content, features, and functionality of DataInsight services are owned by us and are protected by international copyright, trademark, and other intellectual property laws.'
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: '4. Data Privacy',
      content: 'We take your privacy seriously. Our collection and use of personal information is governed by our Privacy Policy. By using our services, you consent to our data practices as described in the Privacy Policy.'
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: '5. Payment Terms',
      content: 'Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law. We reserve the right to change our pricing with 30 days notice.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: '6. Service Availability',
      content: 'While we strive for 99.9% uptime, we do not guarantee uninterrupted access to our services. We reserve the right to modify or discontinue services with reasonable notice.'
    },
    {
      icon: <Scale className="h-6 w-6" />,
      title: '7. Limitation of Liability',
      content: 'DataInsight shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.'
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: '8. Termination',
      content: 'We reserve the right to terminate or suspend your account at any time for violations of these Terms. Upon termination, your right to use the services will immediately cease.'
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: '9. Changes to Terms',
      content: 'We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through our service. Continued use after changes constitutes acceptance.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: '10. Governing Law',
      content: 'These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.'
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
              <Scale className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Please read these terms carefully before using our services
            </p>
            <p className="text-sm text-blue-200 mt-4">
              Last updated: November 4, 2025
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-12"
        >
          <p className="text-gray-700 leading-relaxed">
            <strong>Important:</strong> These Terms and Conditions constitute a legally binding agreement between you and DataInsight. By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mr-4">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Questions About Our Terms?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            If you have any questions or concerns about these Terms and Conditions, please don't hesitate to contact us.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
