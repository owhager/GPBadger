import React, { useState } from 'react';
import { Container, Card, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState(''); 
  const [showPasswordAlert, setShowPasswordAlert] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(''); 

  //this checks if password is at least 6 chars, has 1 number and 1 special char
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,}).*$/;

  //if there's no user logged in, show this message
  if (!user) return <p>you are not logged in.</p>;

  //when the delete button is clicked
  const handleDeleteAccount = async () => {
    const confirm = window.confirm("are you sure? can't undo this.");
    if (!confirm) return;

    try {
      //send delete request to backend with the user's email
      await axios.delete('http://localhost:5657/login', {
        params: { email: user.email }
      });

      //if it worked, log them out and go to login page
      setUser(null);
      alert("account gone forever. poof!");
      navigate('/login');
    } catch (error) {
      console.error("DELETE ERROR: ", error);
      alert("couldn't delete. try again maybe?");
    }
  };

  //when the user wants to change their password
  const handleChangePassword = async (e) => {
    e.preventDefault(); //stop the page from refreshing

    //check if new password is good
    if (!passwordRegex.test(newPassword)) {
      setShowPasswordAlert(true); // show red warning
      return;
    }

    try {
      //tell the backend to update the password
      await axios.put('http://localhost:5657/login', {
        email: user.email,
        newPassword: newPassword
      });

      setNewPassword('');
      setShowPasswordAlert(false);
      setSuccessMessage("yay, password updated!");
    } catch (err) {
      console.error("Password update error:", err);
      alert("that didn’t work. try again.");
    }
  };

  //make the first letter big because we’re fancy
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div
      style={{
        backgroundColor: '#f8f9fa', 
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', 
        paddingTop: '6rem',
        boxSizing: 'border-box'
      }}
    >
    
      <Card className="shadow-sm p-4" style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: 'white'
      }}>
        <h2 className="mb-4"><span role="img" aria-label="user">👤</span> User Profile</h2>
        <p><strong>First Name:</strong> {capitalize(user.firstName)}</p>
        <p><strong>Last Name:</strong> {capitalize(user.lastName)}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <hr />

        {/* form for changing the password */}
        <Form onSubmit={handleChangePassword} className="mb-4">
          <h5 className="mt-3">Change Password</h5>
          <Row className="align-items-center">
            <Col md={8}>
              <Form.Control
                type="password"
                placeholder="new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Col>
            <Col md={4}>
              <Button type="submit" variant="outline-primary" className="w-100">
                Update Password
              </Button>
            </Col>
          </Row>

          {/* show red warning if password is bad */}
          {showPasswordAlert && (
            <Alert variant="danger" className="mt-2">
              password must be 6+ chars and have 1 number + 1 symbol (!@#$%^&*)
            </Alert>
          )}

          {/* show green success message */}
          {successMessage && (
            <Alert variant="success" className="mt-2">
              {successMessage}
            </Alert>
          )}
        </Form>

        {/* delete button centered */}
        <div className="d-flex justify-content-center">
          <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
