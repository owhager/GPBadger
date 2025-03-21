import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Your login logic (e.g., API call) goes here
    console.log('Logging in with:', loginEmail, loginPassword);
    // After a successful login, navigate to the main page route:
    navigate('/main');
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Your sign up logic (e.g., API call) goes here
    console.log('Signing up with:', firstName, lastName, signupEmail, signupPassword);
  };

  // Inline style objects using your custom color: #7D0424
  const containerStyle = {
    maxWidth: '400px',
    margin: '3rem auto',
    padding: '2rem',
    background: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  };

  const tabsStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '1.5rem'
  };

  const tabButtonStyle = (isActive) => ({
    background: 'none',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    color: isActive ? '#7D0424' : '#555',
    fontWeight: isActive ? 'bold' : 'normal'
  });

  const formContainerStyle = {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column'
  };

  const formGroupStyle = {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column'
  };

  const labelStyle = {
    marginBottom: '0.5rem',
    color: '#333'
  };

  const inputStyle = {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px'
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#7D0424',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  };

  const handleButtonHover = (event) => {
    event.target.style.backgroundColor = '#64031D';
  };

  const handleButtonLeave = (event) => {
    event.target.style.backgroundColor = '#7D0424';
  };

  return (
    <div style={containerStyle}>
      <div style={tabsStyle}>
        <button
          style={tabButtonStyle(activeTab === 'login')}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
        <button
          style={tabButtonStyle(activeTab === 'signup')}
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </button>
      </div>

      <div style={formContainerStyle}>
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={formStyle}>
            <div style={formGroupStyle}>
              <label htmlFor="loginEmail" style={labelStyle}>Email:</label>
              <input
                type="email"
                id="loginEmail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label htmlFor="loginPassword" style={labelStyle}>Password:</label>
              <input
                type="password"
                id="loginPassword"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              style={submitButtonStyle}
              onMouseOver={handleButtonHover}
              onMouseOut={handleButtonLeave}
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} style={formStyle}>
            <div style={formGroupStyle}>
              <label htmlFor="firstName" style={labelStyle}>First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label htmlFor="lastName" style={labelStyle}>Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label htmlFor="signupEmail" style={labelStyle}>Email:</label>
              <input
                type="email"
                id="signupEmail"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div style={formGroupStyle}>
              <label htmlFor="signupPassword" style={labelStyle}>Password:</label>
              <input
                type="password"
                id="signupPassword"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              style={submitButtonStyle}
              onMouseOver={handleButtonHover}
              onMouseOut={handleButtonLeave}
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserPage;
