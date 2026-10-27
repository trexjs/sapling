import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle forgot password logic here
    console.log('Reset code sent to:', email);
    setIsSubmitted(true);
  };
  
  // Form validation
  const isFormValid = email.trim() !== '' && email.includes('@');

  return (
    <AuthLayout>
      <div>
        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
              Forgot your password?
            </h2>
            
            <p className="text-center text-sm text-gray-600 mb-8">
              Enter your email address and we'll send you a reset code
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              {/* Send Reset Code Button */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full font-medium py-2.5 rounded-md transition-all shadow-sm ${
                  isFormValid
                    ? 'bg-gradient-to-r from-teal-400 to-teal-500 text-white hover:from-teal-500 hover:to-teal-600 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Send reset code
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
                Back to login
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Check your email
              </h2>
              <p className="text-sm text-gray-600">
                We've sent a password reset code to<br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
              <Link
                to="/reset-password"
                className="block w-full bg-gradient-to-r from-teal-400 to-teal-500 text-white font-medium py-2.5 rounded-md hover:from-teal-500 hover:to-teal-600 transition-all shadow-sm text-center"
              >
                Enter reset code
              </Link>

              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                Didn't receive the email? Try again
              </button>

              <div className="text-center text-sm text-gray-600">
                <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
                  Back to login
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
