import React, { useState,useEffect  } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import si from "./side-img.svg";
import config from '../../config';

export const Signup = () => {
  const navigate = useNavigate();
  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null; // Cookie not found
  }
  useEffect(() => {
    
    const userCookie = getCookie("user");
    if(userCookie)
    { if (userCookie.userType) {
      navigate("/Success");
    }
    else navigate("/FirstVisit")}
  }, [navigate]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
  
      // Send a POST request to your backend API
      const response = await fetch(`${config.backend_url}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the user registration data
      });

      
  
      if (response.ok) {
        // User account created successfully
        alert('Signup successful!'); // Redirect to the login page or perform any other action
        navigate('/FirstVisit');
      } else {
        // Handle server error or duplicate user error
        alert('Signup failed. Please try again.');
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
  };
  
  
  const handleGitHubSignup = (e) => {
    e.preventDefault();
    window.location.href = `${config.backend_url}/auth/github`;
    
  };

  const handleGoogleSignup = (e) => {
    e.preventDefault();
    const url=`${config.backend_url}/auth/google`;
    alert(url);
    window.location.href = `${config.backend_url}/auth/google`;
  };
   
  return (
    <div className="background">
      <div className="container">
        <div className="left-section">
          <form>
            <img src={logo} alt="Logo" className="logo-small" />
            <h5>Create Your Account</h5>
            <div className="input-section">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                onChange={handleInputChange}
              />
            </div>
            <div className="input-section">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                onChange={handleInputChange}
              />
            </div>
            <div className="input-section">
              <input
                type="email"
                name="email"
                placeholder="Email Id"
                onChange={handleInputChange}
              />
            </div>
            <div className="input-section">
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleInputChange}
              />
            </div>
            <div className="input-section">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleInputChange}
              />
            </div>
            <button className="signup-button" onClick={handleSignup}>
              Sign Up
            </button>
            <h4>OR</h4>
            <div className="social-buttons">
              <button className="google-button" onClick={handleGoogleSignup}>
                Sign up with Google
              </button>
              <button className="github-button" onClick={handleGitHubSignup}>
                Sign up with GitHub
              </button>
            </div>
            <p className="login-link">
              Already have an Account? <a href="/Signin">LOGIN</a>
            </p>
          </form>
        </div>
        <div className="right-section">
          <img src={si} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Signup;