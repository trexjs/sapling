import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  ShoppingCart,
  X,
  Check,
  FileText,
  Users,
  Briefcase,
  Heart,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Award,
  Grid,
  List,
  ChevronRight,
  Tag,
  Bookmark,
  BookOpen,
  Code,
  Lightbulb,
  Quote,
  CheckCircle2,
  Building2
} from 'lucide-react';

const TemplatesMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

  const categories = [
    { id: 'all', name: 'All Templates', icon: FileText, count: 250 },
    { id: 'business', name: 'Business', icon: Briefcase, count: 45 },
    { id: 'education', name: 'Education', icon: Users, count: 38 },
    { id: 'healthcare', name: 'Healthcare', icon: Heart, count: 32 },
    { id: 'ecommerce', name: 'E-commerce', icon: ShoppingCart, count: 28 },
    { id: 'events', name: 'Events', icon: Star, count: 25 },
    { id: 'hr', name: 'HR & Recruitment', icon: Users, count: 22 },
    { id: 'survey', name: 'Surveys', icon: TrendingUp, count: 30 }
  ];

  const templates = [
    {
      id: 1,
      name: 'Contact Form Pro',
      description: 'Professional contact form with file upload and auto-response',
      category: 'business',
      price: 0,
      rating: 4.8,
      reviews: 1250,
      downloads: 50000,
      featured: true,
      premium: false,
      thumbnail: 'contact-form',
      fields: ['Name', 'Email', 'Phone', 'Message', 'File Upload'],
      features: ['Auto-response', 'Spam protection', 'Mobile responsive']
    },
    {
      id: 2,
      name: 'Event Registration',
      description: 'Complete event registration with payment integration',
      category: 'events',
      price: 29,
      rating: 4.9,
      reviews: 890,
      downloads: 12000,
      featured: true,
      premium: true,
      thumbnail: 'event-registration',
      fields: ['Attendee Info', 'Ticket Selection', 'Payment', 'Dietary Preferences'],
      features: ['Payment gateway', 'QR code tickets', 'Email confirmations']
    },
    {
      id: 3,
      name: 'Job Application Form',
      description: 'Comprehensive job application with resume upload',
      category: 'hr',
      price: 0,
      rating: 4.7,
      reviews: 2100,
      downloads: 45000,
      featured: false,
      premium: false,
      thumbnail: 'job-application',
      fields: ['Personal Info', 'Experience', 'Education', 'Resume Upload'],
      features: ['Resume parsing', 'Skill assessment', 'Interview scheduling']
    },
    {
      id: 4,
      name: 'Patient Intake Form',
      description: 'HIPAA-compliant patient intake form',
      category: 'healthcare',
      price: 49,
      rating: 5.0,
      reviews: 450,
      downloads: 8000,
      featured: true,
      premium: true,
      thumbnail: 'patient-intake',
      fields: ['Patient Details', 'Medical History', 'Insurance', 'Consent'],
      features: ['HIPAA compliant', 'E-signature', 'Secure storage']
    },
    {
      id: 5,
      name: 'Customer Feedback Survey',
      description: 'Multi-step customer satisfaction survey',
      category: 'survey',
      price: 0,
      rating: 4.6,
      reviews: 3200,
      downloads: 65000,
      featured: false,
      premium: false,
      thumbnail: 'feedback-survey',
      fields: ['Rating Scale', 'Multiple Choice', 'Open Text', 'NPS Score'],
      features: ['Logic branching', 'Analytics dashboard', 'Export results']
    },
    {
      id: 6,
      name: 'Order Form with Calculator',
      description: 'Dynamic order form with price calculation',
      category: 'ecommerce',
      price: 39,
      rating: 4.8,
      reviews: 670,
      downloads: 15000,
      featured: true,
      premium: true,
      thumbnail: 'order-form',
      fields: ['Product Selection', 'Quantity', 'Shipping', 'Payment'],
      features: ['Auto-calculation', 'Inventory sync', 'Payment processing']
    },
    {
      id: 7,
      name: 'Student Enrollment',
      description: 'Complete student enrollment and registration',
      category: 'education',
      price: 0,
      rating: 4.7,
      reviews: 1800,
      downloads: 38000,
      featured: false,
      premium: false,
      thumbnail: 'student-enrollment',
      fields: ['Student Info', 'Guardian Details', 'Course Selection', 'Documents'],
      features: ['Document upload', 'Payment plans', 'Automated emails']
    },
    {
      id: 8,
      name: 'Lead Generation Form',
      description: 'High-converting lead capture form',
      category: 'business',
      price: 19,
      rating: 4.9,
      reviews: 2500,
      downloads: 55000,
      featured: true,
      premium: true,
      thumbnail: 'lead-generation',
      fields: ['Contact Info', 'Company Details', 'Requirements', 'Budget'],
      features: ['CRM integration', 'Lead scoring', 'Auto-follow-up']
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesPricing = selectedPricing === 'all' || 
                          (selectedPricing === 'free' && template.price === 0) ||
                          (selectedPricing === 'premium' && template.price > 0);
    return matchesSearch && matchesCategory && matchesPricing;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const TemplatePreviewModal = ({ template, onClose }) => {
    if (!template) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200">
          <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-8 py-5 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{template.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">{template.category}</span>
                  {template.premium && (
                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                      PREMIUM
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Preview */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Form Preview</h4>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200">
                    <div className="space-y-5">
                      {template.fields.map((field, index) => (
                        <div key={index}>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {field}
                          </label>
                          <div className="w-full h-11 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"></div>
                        </div>
                      ))}
                      <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                        Submit Form
                      </button>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">Key Features</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-800 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Stats */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <span className="text-3xl font-bold text-gray-900">{template.rating}</span>
                    <span className="text-gray-600 text-sm">({template.reviews} reviews)</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Download className="w-5 h-5 text-indigo-600" />
                      <span className="text-gray-700 font-medium">{template.downloads.toLocaleString()} downloads</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <span className="text-gray-700 font-medium">{template.fields.length} form fields</span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                  <div className="text-center mb-6">
                    {template.price === 0 ? (
                      <>
                        <div className="text-5xl font-black mb-2">FREE</div>
                        <div className="text-white/80">Start using now</div>
                      </>
                    ) : (
                      <>
                        <div className="text-5xl font-black mb-2">${template.price}</div>
                        <div className="text-white/80">one-time payment</div>
                      </>
                    )}
                  </div>
                  <button className="w-full bg-white text-indigo-600 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition-all mb-3 shadow-lg hover:shadow-xl hover:scale-105">
                    {template.price === 0 ? 'Use Template' : 'Buy Template'}
                  </button>
                  <button className="w-full border-2 border-white/30 text-white py-3.5 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
                    Try Demo
                  </button>
                </div>

                {/* Description */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Description
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const featuredTemplates = templates.filter(t => t.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Revamped Hero Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-semibold mb-8 border border-white/30 hover:bg-white/30 transition-all cursor-default">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>250+ Professional Templates</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            {/* Main Heading with Gradient Text */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="block">Find the Perfect</span>
              <span className="block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient">
                Form Template
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Browse our curated collection of professional templates. Start with a template and customize it to match your brand in minutes.
            </p>
          </div>

          {/* Enhanced Search Bar with Glass Effect */}
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search templates by name, category, or use case..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-14 py-6 text-lg rounded-2xl border-0 text-gray-900 placeholder-gray-500 shadow-2xl focus:ring-4 focus:ring-white/50 outline-none transition-all bg-white/95 backdrop-blur-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Quick Search Tags */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {['Contact Forms', 'Surveys', 'Registration', 'Applications', 'Feedback'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold hover:bg-white/30 transition-all border border-white/30 hover:scale-105 hover:border-white/50"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Templates Section */}
      {featuredTemplates.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span>Editor's Choice</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Featured Templates</h2>
                <p className="text-lg text-gray-600">Hand-picked templates recommended by our team</p>
              </div>
              <Link
                to="#all-templates"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                View All Templates
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredTemplates.slice(0, 3).map((template) => (
                <div
                  key={template.id}
                  className="relative bg-white rounded-2xl p-6 hover:shadow-2xl transition-all cursor-pointer group border-2 border-indigo-100 hover:border-indigo-300 overflow-hidden"
                  onClick={() => setPreviewTemplate(template)}
                >
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      {template.premium && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-md">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-5 line-clamp-2">{template.description}</p>
                    
                    {/* Stats Row */}
                    <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-200">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-900">{template.rating}</span>
                        <span className="text-gray-500">({template.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Download className="w-4 h-4" />
                        <span className="font-medium">{(template.downloads / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    
                    {/* Action Row */}
                    <div className="flex items-center justify-between">
                      {template.price === 0 ? (
                        <div className="flex items-center gap-2">
                          <Tag className="w-5 h-5 text-green-600" />
                          <span className="text-xl font-bold text-green-600">FREE</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Tag className="w-5 h-5 text-indigo-600" />
                          <span className="text-xl font-bold text-gray-900">${template.price}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-indigo-600 font-semibold group-hover:gap-3 transition-all">
                        <span className="text-sm">Preview</span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Categories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-lg text-gray-600">Find templates organized by industry and use case</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.filter(c => c.id !== 'all').map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  document.getElementById('all-templates')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white rounded-2xl p-5 md:p-6 hover:shadow-xl transition-all group text-left border-2 border-gray-100 hover:border-indigo-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:from-indigo-600 group-hover:to-purple-600 transition-all group-hover:scale-110">
                  <category.icon className="w-6 h-6 md:w-7 md:h-7 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base group-hover:text-indigo-600 transition-colors">{category.name}</h3>
                <p className="text-xs md:text-sm text-gray-600 font-medium">{category.count} templates</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Banner */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Trusted by Thousands Worldwide</h2>
            <p className="text-xl text-white/90">Join the community of professionals using our templates</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center hover:bg-white/20 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">250+</div>
              <div className="text-white/90 font-medium">Templates Available</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center hover:bg-white/20 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500K+</div>
              <div className="text-white/90 font-medium">Downloads</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center hover:bg-white/20 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 fill-white" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.8★</div>
              <div className="text-white/90 font-medium">Average Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center hover:bg-white/20 transition-all hover:scale-105">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-white/90 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* All Templates Section */}
      <div id="all-templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">All Templates</h2>
          <p className="text-lg text-gray-600">Explore our complete collection of {templates.length} professional form templates</p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar Filters */}
          <div className="lg:col-span-1">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full mb-4 flex items-center justify-between px-4 py-3 bg-white rounded-xl border-2 border-gray-200 font-semibold text-gray-900 hover:border-indigo-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters {(selectedCategory !== 'all' || selectedPricing !== 'all') && '(Active)'}
              </span>
              <ChevronRight className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
            </button>
            
            <div className={`bg-white rounded-2xl shadow-lg p-6 sticky top-4 border border-gray-100 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-indigo-50 text-indigo-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500">{category.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Pricing</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedPricing('all')}
                    className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      selectedPricing === 'all'
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    All Templates
                  </button>
                  <button
                    onClick={() => setSelectedPricing('free')}
                    className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      selectedPricing === 'free'
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Free Templates
                  </button>
                  <button
                    onClick={() => setSelectedPricing('premium')}
                    className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                      selectedPricing === 'premium'
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Premium Templates
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== 'all' || selectedPricing !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPricing('all');
                    setSearchQuery('');
                    setShowFilters(false);
                  }}
                  className="w-full px-4 py-2.5 bg-red-50 text-red-700 border-2 border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="lg:col-span-3">
            {/* Enhanced Sort and Results Count */}
            <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-bold text-gray-900">{sortedTemplates.length}</span>
                    <span className="text-lg text-gray-600">templates</span>
                  </div>
                  {(selectedCategory !== 'all' || selectedPricing !== 'all' || searchQuery) && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                      <p className="text-sm text-indigo-600 font-medium">Filters active</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-xl p-1.5">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === 'grid' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="Grid view"
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2.5 rounded-lg transition-all ${
                        viewMode === 'list' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-600 hover:text-gray-900'
                      }`}
                      title="List view"
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 sm:flex-none px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white hover:border-indigo-300 transition-colors"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Templates Grid/List */}
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
              {sortedTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-xl transition-all overflow-hidden group border border-gray-100 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  {/* Thumbnail */}
                  <div className={`relative bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center ${
                    viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'
                  }`}>
                    {template.featured && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        FEATURED
                      </div>
                    )}
                    {template.premium && (
                      <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full">
                        PREMIUM
                      </div>
                    )}
                    <FileText className="w-20 h-20 text-indigo-600 opacity-50" />
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">Preview</span>
                      </div>
                    </button>
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${
                    viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''
                  }`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {template.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{template.rating}</span>
                        <span>({template.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{(template.downloads / 1000).toFixed(0)}K</span>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      {template.price === 0 ? (
                        <span className="text-lg font-bold text-green-600">FREE</span>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">${template.price}</span>
                      )}
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        {template.price === 0 ? 'Use Template' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced No Results */}
            {sortedTemplates.length === 0 && (
              <div className="col-span-2 text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No templates found</h3>
                  <p className="text-gray-600 mb-8">
                    We couldn't find any templates matching your criteria. Try adjusting your filters or search query.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedPricing('all');
                      setSearchQuery('');
                    }}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <X className="w-5 h-5" />
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Popular Use Cases</h2>
            <p className="text-lg text-gray-600">See how teams across industries use our templates</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lead Generation</h3>
              <p className="text-gray-600 mb-6">Capture qualified leads with smart forms that integrate with your CRM and marketing tools.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">CRM integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Lead scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Auto-follow-ups</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Patient Intake</h3>
              <p className="text-gray-600 mb-6">HIPAA-compliant forms for healthcare providers to collect patient information securely.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">HIPAA compliant</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">E-signatures</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Secure storage</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Event Registration</h3>
              <p className="text-gray-600 mb-6">Streamline event registrations with payment processing and automated confirmations.</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Payment gateway</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">QR code tickets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Email confirmations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real stories from real users</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-indigo-600 mb-4" />
              <p className="text-gray-700 mb-6 italic">
                "The templates saved us weeks of development time. We were able to launch our patient intake system in just 3 days!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SM</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Dr. Sarah Mitchell</div>
                  <div className="text-sm text-gray-600">Healthcare Director, MediCare Plus</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-indigo-600 mb-4" />
              <p className="text-gray-700 mb-6 italic">
                "Best investment we've made. The lead generation forms increased our conversion rate by 40% in the first month."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">MC</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-600">Marketing Director, TechStart Inc.</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-indigo-600 mb-4" />
              <p className="text-gray-700 mb-6 italic">
                "Student enrollment has never been easier. Parents love the simple interface and we love the automated workflows."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">JA</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Jennifer Adams</div>
                  <div className="text-sm text-gray-600">School Administrator, Lincoln Academy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentation & Resources Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Resources & Documentation</h2>
            <p className="text-lg text-gray-600">Everything you need to get started</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <Link
              to="#"
              className="group bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Documentation</h3>
              <p className="text-sm text-gray-600 mb-4">Complete guides and API references</p>
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link
              to="#"
              className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">API Reference</h3>
              <p className="text-sm text-gray-600 mb-4">Integrate with your applications</p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                <span>View API</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link
              to="#"
              className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Tutorials</h3>
              <p className="text-sm text-gray-600 mb-4">Step-by-step video guides</p>
              <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                <span>Watch now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link
              to="#"
              className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Case Studies</h3>
              <p className="text-sm text-gray-600 mb-4">Success stories from customers</p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm">
                <span>Read more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10">
            Join thousands of teams already using our templates to streamline their workflows
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="#all-templates"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Browse Templates
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
};

export default TemplatesMarketplace;
