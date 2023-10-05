import React, { useState } from "react";
import "./Signin.css";
import logo from "./logo.png";
import si from "./side-img.svg";
import {  useNavigate } from "react-router-dom";
import config from '../../config';

export const Signin = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  function setCookie(name, value, hours) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + hours * 60 * 60 * 1000); // Convert hours to milliseconds
    const expires = "expires=" + expirationDate.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      // Assuming formData contains the necessary login data
      console.log(formData);
  
      // Send a POST request to your backend API for user login
      const response = await fetch(`${config.backend_url}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send the user login data
      });
  
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log("Data:-",data);
        const expirationTime = new Date();
        expirationTime.setTime(expirationTime.getTime() + 60 * 60 * 1000); // 1 hour in milliseconds
        document.cookie = `token=${data.token}; expires=${expirationTime.toUTCString()}; path=/;`;
        console.log(data.token);

        setCookie("userid",data.user._id); 
        setCookie("firstname",data.user.firstname); 
        console.log("USer:-",data.user._id);
        alert("Sign in sucessful...!!! \n Please Refresh the page.");
        if(data.user.userType) {
          navigate(`/Success`);
        } else {
          navigate(`/FirstVisit`);
        }
      } else {
        alert("Signin failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  
  

  const handleGitHubSignin = (e) => {
    e.preventDefault();
    window.location.href = `${config.backend_url}/auth/github`;

  };
  

  const handleGoogleSignin = (e) => {
    e.preventDefault();
    window.location.href = `${config.backend_url}/auth/google`;
  };

  return (
    <div className="backgroundimg">
      <div className="container">
        <div className="left-section">
          <form>
            <img src={logo} alt="Logo" className="logo-small" />

            <h5>Login to your Account</h5>

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
            <button className="signup-button" onClick={handleSignIn}>
              Log In
            </button>
            <h4>OR</h4>
            <div className="social-buttons">
              <button className="google-button" onClick={handleGoogleSignin}>
                Sign in with Google
              </button>
              <button className="github-button" onClick={handleGitHubSignin}>
                Sign in with GitHub
              </button>
            </div>
            <p className="login-link">
              Don't have an Account? <a href="/">SIGN UP</a>
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
export default Signin;
