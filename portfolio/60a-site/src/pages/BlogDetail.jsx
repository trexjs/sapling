import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, Twitter, Facebook, Linkedin, Link as LinkIcon, Heart, MessageCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(42);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  // Mock blog data - in a real app, this would come from an API
  const blogPosts = {
    1: {
      id: 1,
      title: 'The Future of Data Analytics: Trends to Watch in 2025',
      excerpt: 'Discover the top data analytics trends that will shape the industry in the coming year.',
      content: `
        <h2>The Rise of AI-Powered Analytics</h2>
        <p>Artificial Intelligence is revolutionizing the way we approach data analytics. Machine learning algorithms are now capable of identifying patterns and insights that would take human analysts weeks to discover. This transformation is not just about speed—it's about depth and accuracy.</p>

        <h2>Real-Time Analytics Becomes Standard</h2>
        <p>The demand for real-time insights is growing exponentially. Businesses can no longer afford to wait for daily or weekly reports. Real-time analytics enables immediate decision-making, which is crucial in today's fast-paced business environment.</p>

        <blockquote>
          "The future belongs to those who can make decisions at the speed of data." - Anonymous
        </blockquote>

        <h2>Edge Computing and IoT Integration</h2>
        <p>With the proliferation of IoT devices, edge computing is becoming essential for processing data closer to its source. This approach reduces latency and bandwidth costs while enabling faster insights from connected devices.</p>

        <h2>Data Privacy and Ethics</h2>
        <p>As data collection grows, so does the importance of privacy and ethical considerations. Organizations must balance the need for insights with responsible data practices. This includes implementing robust data governance frameworks and ensuring compliance with regulations like GDPR and CCPA.</p>

        <h2>The Human Element</h2>
        <p>Despite technological advances, human expertise remains crucial. The best analytics platforms combine AI capabilities with human intuition and domain knowledge to provide truly actionable insights.</p>
      `,
      date: 'May 15, 2025',
      readTime: '5 min read',
      category: 'Analytics',
      author: 'Sarah Chen',
      authorRole: 'Chief Data Officer',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      tags: ['AI', 'Analytics', 'Future Trends', 'Data Science']
    },
    2: {
      id: 2,
      title: 'How AI is Transforming Business Intelligence',
      excerpt: 'Learn how artificial intelligence is revolutionizing the way businesses analyze and leverage their data.',
      content: `
        <h2>AI-Driven Decision Making</h2>
        <p>Business Intelligence (BI) has evolved from static reports to dynamic, AI-powered systems that provide predictive insights. This transformation enables organizations to move from reactive to proactive decision-making.</p>

        <h2>Automated Data Discovery</h2>
        <p>Traditional BI required analysts to manually explore data. AI algorithms can now automatically identify correlations, anomalies, and trends that might otherwise go unnoticed. This capability democratizes data analysis across organizations.</p>

        <h2>Natural Language Processing</h2>
        <p>Modern BI tools now understand natural language queries. Instead of complex SQL queries, users can simply ask questions like "What were our sales trends last quarter?" and receive instant visualizations and insights.</p>

        <h2>Predictive Analytics</h2>
        <p>AI enables businesses to predict future trends based on historical data. This capability is particularly valuable for inventory management, demand forecasting, and financial planning.</p>

        <h2>Implementation Challenges</h2>
        <p>While the benefits are clear, successful AI implementation requires careful planning. Organizations need to ensure data quality, invest in training, and establish governance frameworks to maximize ROI.</p>
      `,
      date: 'April 28, 2025',
      readTime: '7 min read',
      category: 'AI',
      author: 'Michael Rodriguez',
      authorRole: 'VP of Engineering',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      tags: ['AI', 'Business Intelligence', 'Machine Learning', 'Predictive Analytics']
    },
    3: {
      id: 3,
      title: 'Building a Data-Driven Culture in Your Organization',
      excerpt: 'Key strategies for fostering a data-driven mindset across your company.',
      content: `
        <h2>The Importance of Data Culture</h2>
        <p>Building a data-driven culture is essential for organizations that want to remain competitive. It's not just about having data—it's about having a workforce that understands how to use it effectively.</p>

        <h2>Leadership Buy-In</h2>
        <p>Cultural change starts at the top. Leaders must champion data-driven decision-making and demonstrate its value through their own actions. This creates a ripple effect throughout the organization.</p>

        <h2>Education and Training</h2>
        <p>Investing in data literacy across all levels of the organization is crucial. This includes basic data understanding for non-technical staff and advanced analytics training for specialists.</p>

        <h2>Tools and Technology</h2>
        <p>Providing the right tools is essential for enabling data-driven work. User-friendly analytics platforms, self-service BI tools, and automated reporting systems empower employees at all levels.</p>

        <h2>Measuring Success</h2>
        <p>Track metrics like data usage, decision speed, and business outcomes to measure the impact of your data culture initiatives. Regular assessments help identify areas for improvement.</p>

        <h2>Sustaining the Culture</h2>
        <p>Data culture requires ongoing effort. Regular communication, recognition of data-driven successes, and continuous learning opportunities help maintain momentum over time.</p>
      `,
      date: 'April 10, 2025',
      readTime: '6 min read',
      category: 'Business',
      author: 'Emily Watson',
      authorRole: 'Head of Data Strategy',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
      tags: ['Data Culture', 'Organization', 'Leadership', 'Data Literacy']
    }
  };

  const post = blogPosts[id];

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0" style={{ backgroundImage: `url(${post.image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }}></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 text-sm mb-6">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full font-medium">{post.category}</span>
              <span className="flex items-center text-white/80">
                <Calendar className="h-4 w-4 mr-1" />
                {post.date}
              </span>
              <span className="flex items-center text-white/80">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{post.title}</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl">{post.excerpt}</p>

            {/* Author & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-lg">{post.author}</p>
                  <p className="text-blue-200 text-sm">{post.authorRole}</p>
                </div>
              </div>
              
              {/* Social Share */}
              <div className="flex items-center space-x-2">
                <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors">
                  <Twitter className="h-5 w-5" />
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors">
                  <Facebook className="h-5 w-5" />
                </button>
                <button className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors">
                  <Linkedin className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-80 object-cover" />
              <div className="p-8 md:p-12">
                <div
                  className="prose prose-lg prose-blue max-w-none"
                  style={{
                    '--tw-prose-headings': '#1f2937',
                    '--tw-prose-body': '#4b5563',
                    '--tw-prose-bold': '#111827',
                    '--tw-prose-links': '#2563eb',
                    '--tw-prose-quotes': '#6b7280'
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>

            {/* Engagement Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center space-x-2 transition-colors ${
                      isLiked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-semibold">{likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageCircle className="h-6 w-6" />
                    <span className="font-semibold">12</span>
                  </button>
                </div>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <LinkIcon className="h-5 w-5" />
                  <span className="font-medium">Copy Link</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.aside 
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Table of Contents */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-blue-600 hover:text-blue-800 transition-colors">Introduction</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Key Insights</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Implementation</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Best Practices</a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Conclusion</a>
                </li>
              </ul>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get the latest insights delivered to your inbox weekly.
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="w-full bg-white text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.aside>
        </div>

        {/* Tags */}
        <motion.div 
          className="mt-12 bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Related Posts CTA */}
        <motion.div 
          className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold mb-3">Enjoyed this article?</h3>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Explore more insights on data analytics, AI, and business intelligence.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Read More Articles
            <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
          </Link>
        </motion.div>
      </article>
    </div>
  );
};

export default BlogDetail;
