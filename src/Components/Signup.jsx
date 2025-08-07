import React, { useState } from 'react';
import "../Styles/signup.css";
import { User, Mail, UserCheck, Shield, Lock } from 'lucide-react';

export default function CreateAccountForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // API call function
  const signUpUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:3000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: userData.name,
          Email: userData.email,
          Password: userData.password,
          Role: userData.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Sign up successful:', data);
        return { success: true, data };
      } else {
        console.error('Sign up failed:', data.message);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Network error:', error);
      return { success: false, error: 'Network error. Please check if the server is running.' };
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const accountData = {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password,
        role: formData.role
      };
      
      console.log('Creating account with data:', accountData);
      
      // Call the API
      const result = await signUpUser(accountData);
      
      if (result.success) {
        // Show success state
        setIsSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            password: '',
            role: 'freelancer'
          });
          setIsSuccess(false);
        }, 3000);
      } else {
        // Show API error
        setApiError(result.error);
      }
      
    } catch (error) {
      console.error('Error creating account:', error);
      setApiError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'freelancer'
    });
    setErrors({});
    setIsSuccess(false);
    setApiError('');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield className="role-icon" />;
      case 'user':
        return <UserCheck className="role-icon" />;
      default:
        return <User className="role-icon" />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin':
        return 'Full system access and user management';
      case 'user':
        return 'Standard user access';
      case 'freelancer':
        return 'Access to freelance projects and tools';
      default:
        return '';
    }
  };

  if (isSuccess) {
    return (
      <div className="create-account-container">
        <div className="create-account-card text-center">
          <div className="success-icon">
            <UserCheck className="icon" />
          </div>
          <h2 className="success-title">Account Created Successfully!</h2>
          <p className="success-subtitle">
            Welcome {formData.name}! Your account has been successfully created.
          </p>
          <div className="account-summary">
            <div className="summary-content">
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Role:</strong> {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="success-button"
          >
            Create Another Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-account-container">
      <div className="create-account-card">
        <div className="create-account-header">
          <div className="header-icon">
            <UserCheck className="icon" />
          </div>
          <h2 className="header-title">
            Create New Account
          </h2>
          <p className="header-subtitle">
            Set up a new user account
          </p>
        </div>

        <div className="create-account-form">
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

          <div className="form-group">
            <label className="form-label">
              Full Name *
            </label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="Enter full name"
              />
            </div>
            {errors.name && (
              <p className="error-message">{errors.name}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Email Address *
            </label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter email address"
              />
            </div>
            {errors.email && (
              <p className="error-message">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Password *
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter password"
              />
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Role *
            </label>
            <div className="role-selection">
              {['freelancer', 'admin', 'user'].map((role) => (
                <label
                  key={role}
                  className={`role-option ${formData.role === role ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleInputChange}
                    className="role-radio"
                  />
                  <div className={`radio-indicator ${formData.role === role ? 'checked' : ''}`}>
                    {formData.role === role && (
                      <div className="radio-dot"></div>
                    )}
                  </div>
                  <div className="role-content">
                    <div className={`role-icon-wrapper ${formData.role === role ? 'selected' : ''}`}>
                      {getRoleIcon(role)}
                    </div>
                    <div className="role-details">
                      <div className={`role-name ${formData.role === role ? 'selected' : ''}`}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </div>
                      <div className={`role-description ${formData.role === role ? 'selected' : ''}`}>
                        {getRoleDescription(role)}
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && (
              <p className="error-message">{errors.role}</p>
            )}
          </div>

          <div className="button-group">
            <button
              onClick={handleReset}
              className="reset-button"
              disabled={isSubmitting}
            >
              Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </div>

        <div className="form-footer">
          <p className="required-note">
            * Required fields
          </p>
        </div>
      </div>
    </div>
  );
}