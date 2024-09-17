// import react.
import React from 'react';
// importing home component
import SendAndReceive from '../components/SendAndReceive';
// import react router.
import { Navigate, Route, useNavigate } from 'react-router-dom';

const PrivateSendAndReceive = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('auth');
  
    return (
        
          isAuthenticated ? (
            <SendAndReceive />
          ) : ( 
            <Navigate to="/login" />
          )
    );
  };

export default PrivateSendAndReceive;