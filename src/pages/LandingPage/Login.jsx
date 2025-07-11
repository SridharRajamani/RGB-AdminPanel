import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Cake, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import './Login.scss';
import { FaGoogle } from 'react-icons/fa';
import PreLoader from '../../components/PreLoader/PreLoader';
import RotaryLogo from '../../Images/NewRGBLogo2.svg';

const heroSlides = [
  {
    title: 'Service Above Self, Creating Lasting Change',
    subtitle: 'Join thousands of Rotarians who dedicate themselves to community service and global impact.',
    image: 'https://images.unsplash.com/photo-1555069855-e580a9adbf43?q=80&w=983&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'Empowering Communities',
    subtitle: 'We support local and global projects in health, education, and peace.',
    image: 'https://plus.unsplash.com/premium_photo-1679429321023-dff2ea455b0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8RW1wb3dlcmluZyUyMENvbW11bml0aWVzfGVufDB8fDB8fHww',
  },
  {
    title: 'Leadership & Fellowship',
    subtitle: 'Rotary connects leaders and builds lifelong friendships through service.',
    image: 'https://plus.unsplash.com/premium_photo-1742842721059-161759fe004e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title: 'People of Action',
    subtitle: 'Be part of a network that takes action to create lasting change.',
    image: 'https://plus.unsplash.com/premium_photo-1661775317533-2163ba4dbc93?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      // Handle successful submission here
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      // Handle Google token response
      alert('Google login successful!');
      console.log(tokenResponse);
    },
    onError: () => {
      alert('Google login failed');
    }
  });

  function handleAppleLogin() {
    window.location.href = APPLE_AUTH_URL;
  }

  // Show loader during form submission
  if (isSubmitting) {
    return <PreLoader />;
  }

  return (
    <div className="login-container">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="login-content">
          {/* Left Side - Hero Section */}
          <div className="hero-section">
            {/* Header */}
            <div className="hero-header">
              <div className="logo">
                <img src={RotaryLogo} alt="Rotary Logo" className="logo-icon" style={{width: '12rem', height: 'auto'}} />
              </div>
              <Link to="/" className="back-link">
                <ArrowLeft size={16} />
                Back to website
              </Link>
            </div>

            {/* Background Image */}
            <div className="hero-background">
              <img 
                src={heroSlides[activeSlide].image}
                alt="Rotary Club background" 
                className="hero-bg-image"
              />
            </div>

            {/* Content */}
            <div className="hero-content">
              <motion.h1 
                className="hero-title"
                key={activeSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {heroSlides[activeSlide].title}
              </motion.h1>
              <motion.p 
                className="hero-subtitle"
                key={activeSlide + '-subtitle'}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {heroSlides[activeSlide].subtitle}
              </motion.p>
            </div>

            {/* Pagination Dots */}
            <div className="pagination-dots">
              {heroSlides.map((_, idx) => (
                <div key={idx} className={`dot${activeSlide === idx ? ' active' : ''}`}></div>
              ))}
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="form-section">
            <motion.div 
              className="form-container"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Header */}
              <div className="form-header">
                <h2 className="form-title">Create an account</h2>
                <p className="form-subtitle">
                  Already have an account?{' '}
                  <Link to="/signin" className="login-link">Log in</Link>
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="login-form">
                {/* Name Fields */}
                <div className="name-fields">
                  <div className="input-group">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="password-field">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input password-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Terms Checkbox */}
                <div className="terms-section">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="terms-checkbox"
                    required
                  />
                  <label htmlFor="terms" className="terms-label">
                    I agree to the{' '}
                    <Link to="/terms" className="terms-link">Terms & Conditions</Link>
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  className="submit-button"
                  whileHover={agreeToTerms ? { scale: 1.02 } : {}}
                  whileTap={agreeToTerms ? { scale: 0.98 } : {}}
                  disabled={!agreeToTerms}
                  style={{ cursor: !agreeToTerms ? 'not-allowed' : 'pointer' }}
                >
                  Create account
                </motion.button>

                {/* Divider */}
                <div className="divider">
                  <div className="divider-line"></div>
                  <span className="divider-text">Or register with</span>
                </div>

                {/* Social Login Buttons */}
                <div className="social-buttons">
                  <motion.button
                    type="button"
                    className="social-button"
                    onClick={() => googleLogin()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaGoogle    className="social-icon" />
                    Google
                  </motion.button>
                  <motion.button
                    type="button"
                    className="social-button"
                    onClick={handleAppleLogin}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="social-icon" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Apple
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;