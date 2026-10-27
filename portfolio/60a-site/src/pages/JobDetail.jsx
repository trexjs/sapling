import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Briefcase, DollarSign, ArrowLeft, Send } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const jobs = {
    1: {
      id: 1,
      title: 'Senior Frontend Developer',
      type: 'Full-time',
      location: 'Remote',
      department: 'Engineering',
      salary: '$120,000 - $160,000',
      description: 'We are looking for an experienced Frontend Developer to join our growing team and help build the next generation of data analytics tools.',
      responsibilities: [
        'Build and maintain high-quality React applications',
        'Collaborate with designers and backend engineers',
        'Write clean, maintainable, and testable code',
        'Participate in code reviews and technical discussions',
        'Mentor junior developers and contribute to team growth',
        'Optimize application performance and user experience'
      ],
      requirements: [
        '5+ years of experience with React and modern JavaScript',
        'Strong understanding of HTML, CSS, and responsive design',
        'Experience with state management (Redux, Context API)',
        'Familiarity with TypeScript',
        'Experience with testing frameworks (Jest, React Testing Library)',
        'Excellent communication and collaboration skills',
        'Bachelor\'s degree in Computer Science or equivalent experience'
      ],
      niceToHave: [
        'Experience with Next.js or other React frameworks',
        'Knowledge of data visualization libraries (D3.js, Chart.js)',
        'Experience with CI/CD pipelines',
        'Contributions to open-source projects'
      ]
    },
    2: {
      id: 2,
      title: 'Data Scientist',
      type: 'Full-time',
      location: 'San Francisco, CA',
      department: 'Data Science',
      salary: '$130,000 - $180,000',
      description: 'Join our data science team to build cutting-edge analytics solutions and drive data-driven decision making.',
      responsibilities: [
        'Develop and deploy machine learning models',
        'Analyze large datasets to extract actionable insights',
        'Collaborate with product teams to define metrics',
        'Build data pipelines and automation tools',
        'Present findings to stakeholders',
        'Stay current with latest ML/AI research'
      ],
      requirements: [
        'MS or PhD in Computer Science, Statistics, or related field',
        '3+ years of experience in data science or ML engineering',
        'Strong programming skills in Python',
        'Experience with ML frameworks (TensorFlow, PyTorch, scikit-learn)',
        'Proficiency in SQL and data manipulation',
        'Strong statistical and analytical skills',
        'Excellent communication skills'
      ],
      niceToHave: [
        'Experience with big data technologies (Spark, Hadoop)',
        'Knowledge of cloud platforms (AWS, GCP, Azure)',
        'Experience with NLP or computer vision',
        'Published research in ML/AI'
      ]
    },
    3: {
      id: 3,
      title: 'Product Manager',
      type: 'Full-time',
      location: 'New York, NY',
      department: 'Product',
      salary: '$140,000 - $190,000',
      description: 'Lead product development and strategy for our analytics platform, working closely with engineering, design, and business teams.',
      responsibilities: [
        'Define product vision and roadmap',
        'Gather and prioritize product requirements',
        'Work with engineering teams on implementation',
        'Conduct user research and gather feedback',
        'Analyze product metrics and KPIs',
        'Present product updates to leadership',
        'Coordinate cross-functional teams'
      ],
      requirements: [
        '5+ years of product management experience',
        'Experience with SaaS or analytics products',
        'Strong analytical and problem-solving skills',
        'Excellent communication and presentation skills',
        'Experience with agile development methodologies',
        'Data-driven decision making approach',
        'Bachelor\'s degree in Business, CS, or related field'
      ],
      niceToHave: [
        'MBA or advanced degree',
        'Technical background or engineering experience',
        'Experience with B2B enterprise products',
        'Knowledge of data analytics or BI tools'
      ]
    }
  };

  const job = jobs[id];

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <Link to="/careers" className="text-blue-600 hover:text-blue-800">
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/careers')}
            className="flex items-center text-blue-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Careers
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-blue-100">
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                {job.type}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {job.department}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                {job.salary}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Role</h2>
              <p className="text-gray-600 leading-relaxed">{job.description}</p>
            </motion.div>

            {/* Responsibilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                      ✓
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                      •
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Nice to Have */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Nice to Have</h2>
              <ul className="space-y-3">
                {job.niceToHave.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                      +
                    </span>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white sticky top-24"
            >
              <h3 className="text-xl font-bold mb-6">Ready to Apply?</h3>
              <p className="text-blue-100 mb-6">
                Join our team and help us build the future of data analytics.
              </p>
              <Link
                to="/contact"
                className="block w-full text-center px-6 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg mb-4"
              >
                <Send className="inline h-5 w-5 mr-2" />
                Apply Now
              </Link>
              <Link
                to="/careers"
                className="block w-full text-center px-6 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border-2 border-white/30"
              >
                View All Openings
              </Link>

              <div className="mt-8 pt-8 border-t border-white/20">
                <h4 className="font-semibold mb-4">What We Offer</h4>
                <ul className="space-y-3 text-sm text-blue-100">
                  <li>• Competitive salary & equity</li>
                  <li>• Health, dental & vision insurance</li>
                  <li>• 401(k) with company match</li>
                  <li>• Unlimited PTO</li>
                  <li>• Remote work options</li>
                  <li>• Learning & development budget</li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
