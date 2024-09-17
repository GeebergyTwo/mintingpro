// import react.
import React from 'react';
// importing home component
import Withdraw from '../components/Withdraw';
// import react router.
import { Navigate, Route, useNavigate } from 'react-router-dom';

const PrivateWithdraw = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('auth');
  
    return (
        
          isAuthenticated ? (
            <Withdraw />
          ) : ( 
            <Navigate to="/login" />
          )
    );
  };

export default PrivateWithdraw;