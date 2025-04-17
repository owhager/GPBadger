/**
 * @file UserPage.jsx
 * @description React component that provides login, sign-up, and forgot password forms for user authentication.
 *              The forgot password form is accessible via a link in the login form only.
 * 
 * @dependencies
 * - React: core library for building the UI.
 * - react-router-dom: used for client-side routing and navigation.
 * - axios: used for making HTTP requests.
 */

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useUser } from "../src/contexts/UserContext";
import axios from 'axios';

const UserPage = () => {
  const navigate = useNavigate();
  // activeTab is now used for "login", "signup", or "forgotPassword"
  const [activeTab, setActiveTab] = useState('login');
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showSignupAlertModal, setShowSignupAlertModal] = useState(false);
  const [showLoginAlertModal, setShowLoginAlertModal] = useState(false);

  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,}).*$/; // Regex for a password at least 6 charaters long with at least 1 digit and 1 special character

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');

  const [error, setError] = useState('');

  const { setUser } = useUser(); 

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if(passwordRegex.test(loginPassword)) {
    try {
      const response = await axios.get('http://localhost:5657/login', {
        params: { email: loginEmail }
      });
      const user = response.data[0];
      if (user.password === loginPassword) {
        console.log('SUCCESS: login');
        console.log(user);

        setUser({
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name
        }); 
        
        navigate('/main');
        setError('');
      } else {
        setError('Incorrect password! Please try again.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('User does not exist. Please create an account.');
      } else {
        console.error('LOGIN ERROR: ', error);
        setError('An error occurred during login. Please try again.');
      }
    }
  } else {
    setShowLoginAlertModal(true);
  }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (confirmPassword === signupPassword && passwordRegex.test(signupPassword)) {
    try {
      const response = await axios.post('http://localhost:5657/login', {
        email: signupEmail,
        password: signupPassword,
        firstName: firstName,
        lastName: lastName
      });
      console.log(response.data.message);
      console.log('SUCCESS: sign up');

      setUser({
        email: signupEmail,
        firstName,
        lastName
      });

      navigate('/main');
      alert("Sign up successful!");
      setError('');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('A user with that email already exists.');
      } else {
        console.error('SIGN UP ERROR: ', error);
        setError('An error occurred during signup. Please try again.');
      }
    }
  } else {
    setShowSignupAlertModal(true);
  }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset requested for:', forgotEmail);
    // Need to send an email here with the user's password
    setResetEmailSent(true);
    setForgotEmail('');
  };

  // Inline style objects using custom color: #7D0424
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
    justifyContent: 'center',
    marginBottom: '1.5rem'
  };

  const tabButtonStyle = (isActive) => ({
    background: 'none',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
    color: isActive ? '#000000' : '#555',
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
    color: '#404040'
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

  const linkStyle = {
    color: '#3541f0',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginTop: '0.5rem',
    alignSelf: 'flex-end'
  };

  const handleButtonHover = (event) => {
    event.target.style.backgroundColor = '#000000';
    event.target.style.color = '#ffffff';
  };

  const handleButtonLeave = (event) => {
    event.target.style.backgroundColor = '#ffffff';
    event.target.style.color = '#000000';
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4 fw-bold text-dark">📚 GPBadger</h1>
      

<Modal show={showLoginAlertModal} onHide={() => setShowLoginAlertModal(false)}>
  <Modal.Header>
    <Modal.Title>Invalid Login</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>Passwords must be at least 6 characters in length containing at least one number and special character (!@#$%^&*)</p>
    <Button 
    className="mt-3 justify-content-center" 
    onClick={() => setShowLoginAlertModal(false)}
    variant="dark"
    onMouseOver={handleButtonHover}
    onMouseOut={handleButtonLeave}
    style={{backgroundColor: '#ffffff', color: '#000000'}}
    >Close</Button>
  </Modal.Body>
</Modal>

<Modal show={showSignupAlertModal} onHide={() => setShowSignupAlertModal(false)}>
  <Modal.Header>
    <Modal.Title>Invalid Signup</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p>Passwords must match and be at least 6 characters in length containing at least one number and special character (!@#$%^&*)! Please try again.</p>
    <Button 
    className="mt-3 justify-content-center" 
    onClick={() => setShowSignupAlertModal(false)}
    variant="dark"
    onMouseOver={handleButtonHover}
    onMouseOut={handleButtonLeave}
    style={{backgroundColor: '#ffffff', color: '#000000'}}
    >Close</Button>
  </Modal.Body>
</Modal>
    <Container style={containerStyle}>
      <Container style={tabsStyle}>
        <Button
          style={tabButtonStyle(activeTab === 'login')}
          onClick={() => {
            setActiveTab('login');
            setResetEmailSent(false);
          }}
        >
          Login
        </Button>
        <Button
          style={tabButtonStyle(activeTab === 'signup')}
          onClick={() => {
            setActiveTab('signup');
            setResetEmailSent(false);
          }}
        >
          Sign Up
        </Button>
      </Container>

      <Container style={formContainerStyle}>
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={formStyle}>
            <Container style={formGroupStyle}>
              <label htmlFor="loginEmail" style={labelStyle}>Email:</label>
              <input
                type="email"
                id="loginEmail"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </Container>
            <Container style={formGroupStyle}>
              <label htmlFor="loginPassword" style={labelStyle}>Password:</label>
              <input
                type="password"
                id="loginPassword"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </Container>
            <Button
              type="submit"
              variant="outline-dark mt-auto"
              onMouseOver={handleButtonHover}
              onMouseOut={handleButtonLeave}
            >
              Login
            </Button>
            {error && (
              <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
            )}
            <p
              style={linkStyle}
              onClick={() => setActiveTab('forgotPassword')}
            >
              Forgot Password?
            </p>
          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} style={formStyle}>
            <Container style={formGroupStyle}>
              <label htmlFor="firstName" style={labelStyle}>First Name:</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={inputStyle}
              />
            </Container>
            <Container style={formGroupStyle}>
              <label htmlFor="lastName" style={labelStyle}>Last Name:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={inputStyle}
              />
            </Container>
            <Container style={formGroupStyle}>
              <label htmlFor="signupEmail" style={labelStyle}>Email:</label>
              <input
                type="email"
                id="signupEmail"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </Container>
            <Container style={formGroupStyle}>
              <label htmlFor="signupPassword" style={labelStyle}>Password:</label>
              <input
                type="password"
                id="signupPassword"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </Container>
            <Container style={formGroupStyle}>
              <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </Container>
            <Button
              type="submit"
              variant="outline-dark mt-auto"
              onMouseOver={handleButtonHover}
              onMouseOut={handleButtonLeave}
            >
              Sign Up
            </Button>
            {error && (
              <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
            )}
          </form>
        )}

        {activeTab === 'forgotPassword' && (
          <form onSubmit={handleForgotPasswordSubmit} style={formStyle}>
            <p style={{ marginBottom: '1rem', color: '#333' }}>
              Please enter your email, and your password will be sent to you
            </p>
            <Container style={formGroupStyle}>
              <label htmlFor="forgotEmail" style={labelStyle}>Email:</label>
              <input
                type="email"
                id="forgotEmail"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </Container>
            <Button
              type="submit"
              variant="dark"
              onMouseOver={handleButtonHover}
              onMouseOut={handleButtonLeave}
            >
              Submit
            </Button>
            {resetEmailSent && (
              <p style={{ color: 'green', marginTop: '10px' }}>
                Password sent to email
              </p>
            )}
          </form>
        )}
      </Container>
    </Container>
    </Container>   
  );
};

export default UserPage;
