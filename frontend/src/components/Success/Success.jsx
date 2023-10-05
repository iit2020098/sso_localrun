import React, { useEffect } from 'react';

const Success = () => {
  useEffect(() => {
    // You can perform client-side actions here
    // For example, update the UI or user state
    // This code will run after the user is redirected here from the server
  }, []);
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
  // const firstname=
  return (
    <div>
      <h1>Welcome to dashboard Screen</h1>
      <br />
      <>Hello {getCookie("firstname")}, Authentication is sucessful</>
    </div>
  );
};

export default Success;
