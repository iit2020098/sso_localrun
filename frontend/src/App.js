import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin'; // Assuming Signin is a separate component
import FirstVisit from './components/FirstVisit/FirstVisit';
import Success from './components/Success/Success';
import config from './config';
// import dotenv from 'dotenv';
// dotenv.config();

function App() {
  const [token, setToken] = useState({
    token: '',
    time: Date.now(),
  });
  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    console.log(token);
    return null; 
  }
  console.log(config.backendurl);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/SignIn" element={<Signin setToken={setToken} />} />
        {
          (getCookie("userid")) ? (
            <>
              <Route path="/FirstVisit" element={<FirstVisit />} />
              <Route path="/Success" element={<Success/>} />
            </>
          ) : (
            <>
              <Route path="/FirstVisit" element={<Signin />} />
              <Route path="/Success" element={<Signin/>}/>
            </>
          )
        }
        {/* <Route path="/FirstVisit" element={<FirstVisit />} />
        <Route path="/Success" element={<Success/>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
