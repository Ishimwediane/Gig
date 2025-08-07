import React, { useState } from 'react';
import '../Styles/login.css';
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignInForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API call for user login
  const signInUser = async (credentials) => {
    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: credentials.email,
          Password: credentials.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sign in successful:', data);
        
        // Store authentication data
        if (data.token) {
          if (rememberMe) {
            localStorage.setItem('authToken', data.token);
          } else {
            sessionStorage.setItem('authToken', data.token);
          }
        }
        
        if (data.user) {
          const userInfo = {
            id: data.user.id,
            name: data.user.name || data.user.Name,
            email: data.user.email || data.user.Email,
            role: data.user.role || data.user.Role
          };
          
          if (rememberMe) {
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
          } else {
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
          }
        }
        
        return { success: true, data };
      } else {
        console.error('Sign in failed:', data.message || data.error);
        return { 
          success: false, 
          error: data.message || data.error || 'Login failed. Please check your credentials.' 
        };
      }
    } catch (error) {
      console.error('Network error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check if the server is running and try again.' 
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const credentials = {
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      };
      
      console.log('Attempting to sign in with email:', credentials.email);
      
      const result = await signInUser(credentials);
      
      if (result.success) {
        setIsSuccess(true);
        
        // Reset form
        setFormData({
          email: '',
          password: ''
        });
        
        // Redirect after success (uncomment when ready)
        setTimeout(() => {
          // window.location.href = '/dashboard';
          // or if using React Router:
          // navigate('/dashboard');
          console.log('Redirecting to dashboard...');
        }, 2000);
        
      } else {
        setApiError(result.error);
      }
      
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      email: '',
      password: ''
    });
    setErrors({});
    setApiError('');
    setIsSuccess(false);
    setRememberMe(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Success screen
  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon">
              <CheckCircle className="icon" />
            </div>
            <h2 className="auth-title">Welcome Back!</h2>
            <p className="auth-subtitle">
              You have been successfully signed in to your account.
            </p>
            <div className="loading-content">
              <div className="spinner"></div>
              <span>Redirecting to dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">
            <LogIn className="icon" />
          </div>
          <h2 className="auth-title">Sign In</h2>
          <p className="auth-subtitle">Welcome back! Please sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* API Error Message */}
          {apiError && (
            <div className="error-banner" style={{
              backgroundColor: '#fee',
              color: '#c33',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #fcc'
            }}>
              <strong>Error:</strong> {apiError}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
                autoComplete="email"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="error-message">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-button"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="checkbox-input"
                disabled={isSubmitting}
              />
              <span className="checkbox-text">Remember me</span>
            </label>
            <button type="button" className="toggle-button" disabled={isSubmitting}>
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <div className="button-group">
            <button
              type="button"
              onClick={handleReset}
              className="reset-button"
              disabled={isSubmitting}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p className="toggle-text">
            Don't have an account?{' '}
            <button type="button" className="toggle-button">
             <a href='Signup'> Create account</a>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}