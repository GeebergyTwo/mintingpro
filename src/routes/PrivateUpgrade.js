// import react.
import React from 'react';
// importing home component
import UpgradeMint from '../components/UpgradeMint';
// import react router.
import { Navigate, Route, useNavigate } from 'react-router-dom';

const PrivateUpgrade = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('auth');
  
    return (
        
          isAuthenticated ? (
            <UpgradeMint />
          ) : ( 
            <Navigate to="/login" />
          )
    );
  };

export default PrivateUpgrade;