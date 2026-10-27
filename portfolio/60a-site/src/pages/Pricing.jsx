import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, BarChart3, Shield, Zap, Users, Database, Cloud, Lock, Headphones } from 'lucide-react';

const Pricing = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const plans = [
    {
      name: 'Starter',
      price: '₹24,999',
      period: 'per month',
      description: 'Perfect for small teams getting started with analytics',
      features: [
        'Up to 5 users',
        'Basic dashboards',
        'Email support',
        '1 data source',
        'Community forum access'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: '₹99,999',
      period: 'per month',
      description: 'For growing teams with advanced analytics needs',
      features: [
        'Up to 20 users',
        'Advanced dashboards',
        'Priority support',
        '5 data sources',
        'API access',
        'Custom branding'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For organizations with complex data needs',
      features: [
        'Unlimited users',
        'Enterprise-grade security',
        '24/7 dedicated support',
        'Unlimited data sources',
        'Custom integrations',
        'On-premise option',
        'Dedicated account manager'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the perfect plan for your team's needs. No hidden fees, cancel anytime.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${plan.popular ? 'ring-2 ring-blue-500' : 'border border-gray-200'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-sm font-semibold py-1 text-center">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="ml-2 text-gray-500">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 px-6 rounded-md font-medium ${
                    plan.popular 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {plan.cta}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed Features Comparison */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Detailed Feature Comparison
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compare all features across our plans to find the perfect fit for your needs
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-x-auto">
            <div className="min-w-[800px]">
            {/* Table Header - Sticky */}
            <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-16 z-10 shadow-lg">
              <div className="col-span-1 font-bold text-lg">Feature</div>
              <div className="col-span-1 text-center font-bold">Starter</div>
              <div className="col-span-1 text-center font-bold">Professional</div>
              <div className="col-span-1 text-center font-bold">Enterprise</div>
            </div>

            {/* Feature Categories */}
            {[
              {
                category: 'Analytics & Insights',
                icon: <BarChart3 className="h-5 w-5" />,
                features: [
                  { name: 'Custom Dashboards', starter: '5', professional: '20', enterprise: 'Unlimited' },
                  { name: 'Real-time Analytics', starter: false, professional: true, enterprise: true },
                  { name: 'Predictive Analytics', starter: false, professional: true, enterprise: true },
                  { name: 'AI-Powered Insights', starter: false, professional: 'Limited', enterprise: 'Full' },
                  { name: 'Custom Reports', starter: '10/month', professional: '100/month', enterprise: 'Unlimited' },
                ]
              },
              {
                category: 'Data Management',
                icon: <Database className="h-5 w-5" />,
                features: [
                  { name: 'Data Sources', starter: '1', professional: '5', enterprise: 'Unlimited' },
                  { name: 'Data Storage', starter: '10 GB', professional: '100 GB', enterprise: 'Custom' },
                  { name: 'Data Refresh Rate', starter: '24 hours', professional: '1 hour', enterprise: 'Real-time' },
                  { name: 'Historical Data', starter: '3 months', professional: '2 years', enterprise: 'Unlimited' },
                  { name: 'Data Export', starter: 'CSV', professional: 'CSV, Excel, PDF', enterprise: 'All formats' },
                ]
              },
              {
                category: 'Security & Compliance',
                icon: <Shield className="h-5 w-5" />,
                features: [
                  { name: 'SSL Encryption', starter: true, professional: true, enterprise: true },
                  { name: 'Two-Factor Authentication', starter: true, professional: true, enterprise: true },
                  { name: 'Role-Based Access Control', starter: 'Basic', professional: 'Advanced', enterprise: 'Enterprise' },
                  { name: 'SOC 2 Compliance', starter: false, professional: true, enterprise: true },
                  { name: 'GDPR Compliance', starter: true, professional: true, enterprise: true },
                  { name: 'On-Premise Deployment', starter: false, professional: false, enterprise: true },
                ]
              },
              {
                category: 'Collaboration & Support',
                icon: <Users className="h-5 w-5" />,
                features: [
                  { name: 'Team Members', starter: '5', professional: '20', enterprise: 'Unlimited' },
                  { name: 'Shared Workspaces', starter: '1', professional: '5', enterprise: 'Unlimited' },
                  { name: 'Email Support', starter: true, professional: true, enterprise: true },
                  { name: 'Priority Support', starter: false, professional: true, enterprise: true },
                  { name: '24/7 Phone Support', starter: false, professional: false, enterprise: true },
                  { name: 'Dedicated Account Manager', starter: false, professional: false, enterprise: true },
                ]
              },
              {
                category: 'Integration & API',
                icon: <Cloud className="h-5 w-5" />,
                features: [
                  { name: 'Pre-built Integrations', starter: '5', professional: '20', enterprise: 'All' },
                  { name: 'API Access', starter: false, professional: true, enterprise: true },
                  { name: 'Webhooks', starter: false, professional: true, enterprise: true },
                  { name: 'Custom Integrations', starter: false, professional: 'Limited', enterprise: 'Unlimited' },
                  { name: 'API Rate Limit', starter: '-', professional: '10k/day', enterprise: 'Custom' },
                ]
              },
            ].map((category, catIndex) => (
              <div key={catIndex} className={catIndex > 0 ? 'border-t border-gray-200' : ''}>
                {/* Category Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{category.category}</h3>
                  </div>
                </div>

                {/* Features */}
                {category.features.map((feature, featureIndex) => (
                  <div 
                    key={featureIndex}
                    className={`grid grid-cols-4 gap-4 px-6 py-4 ${
                      featureIndex % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                    } hover:bg-blue-50/30 transition-colors`}
                  >
                    <div className="col-span-1 font-medium text-gray-900 flex items-center">
                      {feature.name}
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {typeof feature.starter === 'boolean' ? (
                        feature.starter ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300" />
                        )
                      ) : (
                        <span className="text-gray-700 font-medium">{feature.starter}</span>
                      )}
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {typeof feature.professional === 'boolean' ? (
                        feature.professional ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300" />
                        )
                      ) : (
                        <span className="text-gray-700 font-medium">{feature.professional}</span>
                      )}
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {typeof feature.enterprise === 'boolean' ? (
                        feature.enterprise ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300" />
                        )
                      ) : (
                        <span className="text-gray-700 font-medium">{feature.enterprise}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              FAQ
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to know about our pricing and services
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                question: 'Can I change my plan later?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle. Our flexible pricing ensures you only pay for what you need.'
              },
              {
                question: 'Is there a free trial available?',
                answer: 'Yes, we offer a 14-day free trial for our Professional plan. No credit card required. Experience all premium features risk-free.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, UPI, and bank transfers for annual plans. All transactions are secured with 256-bit SSL encryption.'
              },
              {
                question: 'Do you offer discounts for non-profits?',
                answer: 'Yes, we offer special pricing for non-profit organizations, educational institutions, and startups. Contact our sales team for more information about eligibility and discount rates.'
              },
              {
                question: 'What happens when I reach my data limit?',
                answer: 'We\'ll notify you when you\'re approaching your limit (at 80% and 95%). You can either upgrade your plan or purchase additional data capacity. Your service will continue uninterrupted.'
              },
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period. No cancellation fees apply.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md border-2 border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-all duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-inset group"
                  aria-expanded={openFAQ === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-800 transition-colors pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{
                      rotate: openFAQ === index ? 180 : 0,
                      scale: openFAQ === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <div className={`p-1 rounded-full transition-all duration-200 ${
                      openFAQ === index
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                    }`}>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.4, 0.0, 0.2, 1]
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-2">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
                        <p className="text-gray-700 leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-gray-600 mb-4">
              Still have questions?
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
              Contact Our Team
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
