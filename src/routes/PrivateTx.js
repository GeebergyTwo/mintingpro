// import react.
import React from 'react';
import TransactionList from '../components/Transactions';
// import react router.
import { Navigate, Route, useNavigate } from 'react-router-dom';

const PrivateTx = ({ component: Component, ...rest }) => {
    const isAuthenticated = localStorage.getItem('auth');
  
    return (
        
          isAuthenticated ? (
            < TransactionList/>
          ) : ( 
            <Navigate to="/login" />
          )
    );
  };

export default PrivateTx;