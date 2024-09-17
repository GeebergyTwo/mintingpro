// import react.
import React from 'react';
import MintPower from '../components/MintPower';
// import react router.
import { Navigate, Route, useNavigate } from 'react-router-dom';

const PrivateMint = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('auth');
  
    return (
        
          isAuthenticated ? (
            <MintPower />
          ) : ( 
            <Navigate to="/login" />
          )
    );
  };

export default PrivateMint;