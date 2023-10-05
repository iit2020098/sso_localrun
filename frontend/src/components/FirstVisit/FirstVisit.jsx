import React, { useState } from "react";
import "./FirstVisit.css";
import logo from "./logo.png";
import { useNavigate } from "react-router-dom"; // Import useHistory from React Router
import config from '../../config';
export const FirstVisit = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [optionValue, setOptionValue] = useState(''); // State to store the selected option's value

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };
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
  

  const renderContent = () => {
    if (selectedOption === "Developer") {
      return (
        <div className="f">
          <h5 className="say">Choose Developer Option</h5>
          <div className="developer-content button">
            <button
              className={`sel-button${
                selectedOption === "Self Hosting" ? "active" : ""
              }`}
              value="Self Hosting"
              onClick={(e) => {
                setOptionValue(e.target.value);
                // setOptionValue("Self Hosting");
                handleSubmit();
              }}
            >
              Self Hosting
            </button>
            <button
              className={`sel-button ${
                selectedOption === "Zero Code Hosting" ? "active" : ""
              }`}
              value="Zero Code Hosting"
              onClick={(e) => {
                setOptionValue(e.target.value);
                // setOptionValue("Zero Code Hosting");
                handleSubmit();
              }}
            >
              Zero Code Hosting
            </button>
          </div>
          {/* <div className="company-content">
            <button className="sel-button" onClick={handleSubmit}>
              Submit
            </button>
          </div> */}
        </div>
      );
    } else if (selectedOption === "Company") {
      return (
        <div className="company-content">
          <input type="text" placeholder="Enter Company Name" onChange={(e) => {
      setOptionValue(e.target.value);setSelectedOption("Company");
    }}/>
          <button className="sel-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      );
    } else if (selectedOption === "Organisation") {
      return (
        <div className="organisation-content">
          <input type="text" placeholder="Enter Organization Name" onChange={(e) => {
      setOptionValue(e.target.value);setSelectedOption("Organisation");
    }} />
          <button className="sel-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      );
    } else {
      return null;
    }
  };
  const handleSubmit = async () => {
    console.log("Selected Option:", selectedOption);
    console.log("Option Value:", optionValue);
  
    // Map the selected option to the corresponding value based on your schema
    let userTypeValue = ""; // Initialize it with an empty string by default
  
    switch (selectedOption) {
      case "Developer":
        userTypeValue = "Developer"; // Set it to the appropriate value from your schema
        break;
      case "Company":
        userTypeValue = "Company"; // Set it to the appropriate value from your schema
        break;
      case "Organisation":
        userTypeValue = "Organization"; // Set it to the appropriate value from your schema
        break;
      default:
        // Handle default case or validation
        break;
    }
  
    // Now 'userTypeValue' should have the appropriate value
    const user=getCookie("userid");
    console.log("user",user);
    try {
      const response = await fetch(`${config.backend_url}/api/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user, // Assuming '_id' is defined elsewhere in your code
          userType: userTypeValue, // Use the mapped 'userTypeValue'
        }),
      });
      console.log(response)
      if (response.ok) {
        navigate("/Success");
      } else {
        alert("Values Updation Failed");
      }
    } catch (error) {
      alert(error);
      console.error("Error:", error);
    }
  };
  
  
  return (
    <div className="background">
      <div className="containerfv">
        <img src={logo} alt="Logo" className="logo-small" />
        <h5>Choose from the following</h5>
        <div className="button">
          <button
            className={`sel-button ${
              selectedOption === "Developer" ? "active" : ""
            }`}
            onClick={() => handleOptionClick("Developer")}
          >
            Developer
          </button>
          <button
            className={`sel-button ${
              selectedOption === "Organisation" ? "active" : ""
            }`}
            onClick={() => handleOptionClick("Organisation")}
          >
            Organisation
          </button>
          <button
            className={`sel-button ${
              selectedOption === "Company" ? "active" : ""
            }`}
            onClick={() => handleOptionClick("Company")}
          >
            Company
          </button>
        </div>
        {renderContent()}
        {/* <button className="sel-button" onClick={handleSubmit}>
          Submit
        </button> */}
      </div>
    </div>
  );
};

export default FirstVisit;
