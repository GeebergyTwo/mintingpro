// import react.
import React from 'react';
// importing home component
import FAQS from '../components/FAQS';
// import react router.
import { Navigate, Route, useNavigate } from 'react-router-dom';

const PrivateFaqs = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('auth');
  
    return (
        
          isAuthenticated ? (
            <FAQS />
          ) : ( 
            <Navigate to="/login" />
          )
    );
  };

export default PrivateFaqs;