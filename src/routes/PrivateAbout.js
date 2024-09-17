// import react.
import React from 'react';
// importing home component
import About from '../components/About';
// import react router.
import { Navigate, Route, useNavigate } from 'react-router-dom';

const PrivateAbout = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('auth');
  
    return (
        
          isAuthenticated ? (
            <About />
          ) : ( 
            <Navigate to="/login" />
          )
    );
  };

export default PrivateAbout;