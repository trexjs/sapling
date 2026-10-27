import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Zap, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Database,
  Workflow,
  BarChart3,
  Lock,
  Globe,
  Play,
  Code,
  Palette,
  Layers,
  TrendingUp,
  Award,
  Quote
} from 'lucide-react';

const FormBuilder = () => {
  const [activeTab, setActiveTab] = useState('healthcare');

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Form Creation',
      description: 'Create custom forms effortlessly using powerful, secure AI technology. The only online form builder to deliver touchless form creation.'
    },
    {
      icon: Database,
      title: 'Smart Data Prefill',
      description: 'Say goodbye to blank forms forever. Make every form a standout experience with effortless prefill functionality.'
    },
    {
      icon: Workflow,
      title: 'Advanced Workflows',
      description: 'Add automation features like group approvals and step logic to transform data collection into streamlined processes.'
    },
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'HIPAA, SOC 2, and GDPR compliant. Your data is protected with bank-level encryption and security standards.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track form performance, submission rates, and user behavior with comprehensive analytics dashboards.'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Create forms in multiple languages and reach a global audience with automatic translation features.'
    }
  ];

  const useCases = [
    {
      id: 'healthcare',
      title: 'Healthcare',
      hours: '13',
      description: 'Streamline patient intake, appointment scheduling, and medical records management.',
      benefits: [
        'HIPAA-compliant forms',
        'Patient portal integration',
        'E-signature support',
        'Automated appointment reminders'
      ]
    },
    {
      id: 'education',
      title: 'Education',
      hours: '17',
      description: 'Simplify student enrollment, event registration, and feedback collection.',
      benefits: [
        'Student information systems integration',
        'Parent consent forms',
        'Course registration',
        'Scholarship applications'
      ]
    },
    {
      id: 'financial',
      title: 'Financial Services',
      hours: '14',
      description: 'Secure loan applications, client onboarding, and compliance documentation.',
      benefits: [
        'Bank-level encryption',
        'KYC/AML compliance',
        'Digital signatures',
        'Audit trails'
      ]
    }
  ];

  const templates = [
    { name: 'Contact Form', category: 'General', uses: '50K+' },
    { name: 'Registration Form', category: 'Events', uses: '45K+' },
    { name: 'Survey Form', category: 'Research', uses: '40K+' },
    { name: 'Order Form', category: 'E-commerce', uses: '38K+' },
    { name: 'Application Form', category: 'HR', uses: '35K+' },
    { name: 'Feedback Form', category: 'Customer Service', uses: '32K+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Revamped Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
            <div className="absolute top-20 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-10 left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-white/30">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Trusted by 32,000+ Organizations</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="block">The Online Form Builder</span>
                <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient">
                  for Everyone
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
                Create powerful, secure forms in minutes with AI-powered automation and enterprise-grade security.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
                >
                  Start Free Trial
                  <ArrowRight className="w-6 h-6" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
                  <Play className="w-6 h-6" />
                  Watch Demo
                </button>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-1">10M+</div>
                  <div className="text-white/70 text-sm">Forms Created</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">99.9%</div>
                  <div className="text-white/70 text-sm">Uptime</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1">4.8★</div>
                  <div className="text-white/70 text-sm">Rating</div>
                </div>
              </div>
            </div>
            
            {/* Right Visual */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur-2xl opacity-30"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">Contact Form</div>
                          <div className="text-sm text-gray-500">Live Preview</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Full Name</div>
                        <div className="h-10 bg-gray-100 rounded-lg"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Email Address</div>
                        <div className="h-10 bg-gray-100 rounded-lg"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Message</div>
                        <div className="h-24 bg-gray-100 rounded-lg"></div>
                      </div>
                      <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                        Submit Form
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 mb-8">Trusted for over 18 years by leading organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">MICROSOFT</div>
            <div className="text-2xl font-bold text-gray-400">SALESFORCE</div>
            <div className="text-2xl font-bold text-gray-400">AMAZON</div>
            <div className="text-2xl font-bold text-gray-400">GOOGLE</div>
            <div className="text-2xl font-bold text-gray-400">IBM</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              High-End Functionality, No Extra Complexity
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              For business users thinking there must be a better way to collect, manage, and use data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              One Solution, Thousands of Business Problems Solved
            </h2>
            <p className="text-xl text-gray-600">
              See how organizations save time with our form builder
            </p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            {useCases.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => setActiveTab(useCase.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === useCase.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {useCase.title}
              </button>
            ))}
          </div>

          {useCases.map((useCase) => (
            activeTab === useCase.id && (
              <div key={useCase.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                      <Clock className="w-4 h-4" />
                      <span>Save {useCase.hours} hours per week</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {useCase.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      {useCase.description}
                    </p>
                    <ul className="space-y-3">
                      {useCase.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-8 shadow-lg">
                    <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-24 h-24 text-indigo-600" />
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Say Goodbye to Blank Forms Forever
            </h2>
            <p className="text-xl text-gray-600">
              Start with 1000+ pre-built templates or create your own from scratch
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                    <FileText className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {template.uses}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {template.category}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products/formbuilder/templates"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Browse All Templates
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Play className="w-4 h-4" />
                <span>Watch Demo</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                See How Easy It Is to Build Professional Forms
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Watch our 2-minute demo to see how you can create, customize, and deploy forms in minutes—no coding required.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold mb-2">5 min</div>
                  <div className="text-white/70">Average setup time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">250+</div>
                  <div className="text-white/70">Ready-to-use templates</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">99.9%</div>
                  <div className="text-white/70">Uptime guarantee</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-white/70">Customer support</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-indigo-600 ml-1" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-xl p-4 hidden lg:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Form Created!</div>
                    <div className="text-sm text-gray-600">In just 2 minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Revamped */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Trusted by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of organizations streamlining their data collection
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">32K+</div>
              <div className="text-gray-700 font-medium">Active Organizations</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">10M+</div>
              <div className="text-gray-700 font-medium">Forms Created</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">500M+</div>
              <div className="text-gray-700 font-medium">Submissions Collected</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">99.9%</div>
              <div className="text-gray-700 font-medium">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section - Revamped */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Seamlessly Integrates with Your Favorite Tools
            </h2>
            <p className="text-xl text-gray-600">
              Connect your forms with 1000+ apps and services
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['Salesforce', 'HubSpot', 'Slack', 'Google', 'Zapier', 'Microsoft'].map((tool, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-white hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-gray-100 hover:border-indigo-200 flex items-center justify-center group">
                <div className="text-lg font-bold text-gray-400 group-hover:text-gray-700 transition-colors">{tool}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="#"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all"
            >
              View All Integrations
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Don't just take our word for it
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "This form builder has transformed how we collect patient data. The HIPAA compliance features give us peace of mind.",
                author: "Dr. Sarah Mitchell",
                role: "Healthcare Director",
                company: "MediCare Plus",
                rating: 5
              },
              {
                quote: "We've cut our form creation time by 80%. The templates are professional and the AI features are game-changing.",
                author: "Michael Chen",
                role: "Operations Manager",
                company: "TechStart Inc.",
                rating: 5
              },
              {
                quote: "The best investment we've made. Student enrollment is now seamless, and parents love how easy it is to use.",
                author: "Jennifer Adams",
                role: "School Administrator",
                company: "Lincoln Academy",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8">
                <Quote className="w-10 h-10 text-indigo-600 mb-4" />
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Award key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-indigo-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section - Revamped */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Create Your First Form in 3 Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              No technical skills required
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border-2 border-gray-100">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
                    1
                  </div>
                </div>
                <div className="mt-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Palette className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Choose a Template
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Start with one of our 250+ professional templates or create from scratch
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border-2 border-gray-100">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
                    2
                  </div>
                </div>
                <div className="mt-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Layers className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Customize Your Form
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Drag and drop fields, add your branding, and configure settings with ease
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border-2 border-gray-100">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg">
                    3
                  </div>
                </div>
                <div className="mt-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                    <TrendingUp className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  Publish & Collect Data
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Share your form via link, embed it on your site, or send via email
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Your Data + Your Standards
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Enterprise-grade security and compliance built into every form. Your data is protected with industry-leading encryption and security protocols.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">HIPAA & SOC 2 Compliant</h3>
                    <p className="text-gray-600">Meets the highest standards for healthcare and enterprise security.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">256-bit Encryption</h3>
                    <p className="text-gray-600">Bank-level encryption protects your data in transit and at rest.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">GDPR Ready</h3>
                    <p className="text-gray-600">Built-in compliance tools for international data protection regulations.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl p-12 flex items-center justify-center">
              <Shield className="w-48 h-48 text-indigo-600" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Data Collection?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join 32,000+ organizations using our form builder to save time and streamline workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/80">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default FormBuilder;
