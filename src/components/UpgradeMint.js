import React, { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUser } from '../functionalComponents/UserRoleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';


function UpgradeMint() {
  const { userData, handleGetUser } = useUser();
  const storedUserId = localStorage.getItem('auth');

  // Fetch user data on component mount
  useEffect(() => {
    if (!userData) {
      handleGetUser(storedUserId).then(() => {
        // setLoading(false);
      });
    } else {
      // setLoading(false);
    }
  }, [userData, handleGetUser]);

  const publicKey = 'pk_live_f27d2332cfd754cb3d37657e587bf209a8bb9c32';

  const formatCurrency = (number, decimals = 2) => {
    return Number(number.toFixed(decimals)).toLocaleString();
  };

  const standardPlan = 4000 - userData?.deposit || 0;
  const premiumPlan = 7000 - userData?.deposit || 0;
  const ultimatePlan = 10000 - userData?.deposit || 0;

  const saveTransactionData = async (transactionReference, email, amount, userID, status, planType) => {
    const txDetails = {
      transactionReference: transactionReference,
      email,
      amount,
      userID,
      status,
      planType, // Save the plan type
      timestamp: new Date(),
      description: 'Account Activation',
      transactionType: 'credit',
    };
  
    try {
      const response = await axios.post(
        'https://mintingpro.onrender.com/api/createTransaction',
        txDetails, // Automatically handles stringification
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      console.log('Transaction data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving transaction data:', error.message);
    }
  };

  // updateUserPlanAfterPayment
  const updateUserPlan = async (amount, planType) => {
    try {
      const response = await axios.post(
        'https://mintingpro.onrender.com/api/updateUserPlan',
        {
          userID: userData._id,  // ID of the current user
          planType,   // Type of plan user has paid for
          amount,     // Total amount paid by user
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200 && response.data.success) {
        console.log('User plan updated successfully');
        handleGetUser(storedUserId);  // Fetch fresh user data to reflect the changes in the UI
      } else {
        console.error('Failed to update user plan:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating user plan:', error.message);
    }
  };
  


  const processPayment = (amount, planType) => {
    // Update the user profile or backend with the new plan
    switch (planType) {
      case 'Standard':
        // Update the user to Standard Mint plan
        updateUserPlan(amount, 'Standard');
        break;
      case 'Premium':
        // Update the user to Premium Mint plan
        updateUserPlan(amount, 'Premium');
        break;
      case 'Ultimate':
        // Update the user to Ultimate Mint plan
        updateUserPlan(amount, 'Ultimate');
        break;
      default:
        console.error('Unknown plan type:', amount, planType);
    }
  };
  
  

  // make payment
  const handlePayment = (amount, planType) => {
    const paystackOptions = {
      key: publicKey,
      email: userData.email,
      amount: amount * 100, // Paystack uses amount in kobo (multiply by 100)
      ref: new Date().getTime(),
      callback: (response) => {
        if (response.status === 'success') {
          toast.success('Payment was successful!', {
            position: toast.POSITION.TOP_CENTER,
          });
  
          // Save successful transaction data to the backend with status "success" and planType
          saveTransactionData(response.reference, userData.email, amount, userData._id, 'success', planType);
          processPayment(amount, planType); // Pass the planType to the processPayment function for updating the user’s profile
          
        } else {
          handleFailure(response, planType);
          // saveTransactionData('N/A', userData.email, amount, userData._id, 'failed', planType);
        }
      },
      onClose: () => {
        handleFailure({ message: 'Payment was closed' }, planType);
        // Save failed transaction data with the planType
        // saveTransactionData('N/A', userData.email, amount, userData._id, 'failed', planType);
      },
    };
  
    // Initialize Paystack
    const handler = window.PaystackPop.setup(paystackOptions);
    handler.openIframe();
  };
  
  
  const handleFailure = (error, planType) => {
    toast.error('Payment failed: ' + error.message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  

  const scrollContainer = {
    paddingBottom: '80px',
    paddingTop: '20px',
    minHeight: '100vh', // Ensures content takes at least the full height of the viewport
    boxSizing: 'border-box',
    background: 'linear-gradient(to bottom, #3c3f4c, #262A36)', // Gradient from dark purple to a lighter purple
  };

  const yellowOrangeButtonStyle = {
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    color: 'white',
    background: '#FFA500',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'block',
    marginLeft: 'auto',
  };

  const upgradeInfo = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px', // Add spacing between rows
  };

  const big = {
    fontSize: '20px',
  };

  const bigBold = {
    fontSize: '20px',
    fontWeight: 'bold',
  };

  const decNone = {
    textDecoration: 'none',
  };

  return (
   <div style={scrollContainer} className='pTop-80'>
    <ToastContainer />
     {/* // Main Content Area */}
     <div className='text-warning auto-adjust'>Note: All payments are automatically set to be made in local currency due to guidelines.</div>
     {standardPlan > 1 && (
      
      <div className="main-content">
      <Container>
      <div style={upgradeInfo}>
        <h1>Standard Mint</h1>
        <Link to="/upgrade" style={decNone}>
          <button style={yellowOrangeButtonStyle} onClick={() => handlePayment(standardPlan, 'Standard')}>Activate</button>
        </Link>
      </div>
      <span className='fw-bold' style={{color: '#FFA500'}}>₦{formatCurrency(standardPlan, 2)}</span>
        
        <div className='d-flex align-items-start mt-4'>
          <FontAwesomeIcon icon={faInfoCircle} />
          <p className='mx-2'>Starts with mint rate of <span style={big} className='fw-bold'>{formatCurrency(0.05 / 1.8, 2)}/second</span></p>
        </div>
        <div className='d-flex align-items-start'>
          <FontAwesomeIcon icon={faInfoCircle} />
          <p className='mx-2'>Automatically get upgraded to Level 1</p>
        </div>
        <div className='d-flex align-items-start '>
          <FontAwesomeIcon icon={faInfoCircle} />
          <p className='mx-2'>Could be upgraded up to Level 4</p>
        </div>
      </Container>
      </div>
     )}

        {/* second box */}
        {premiumPlan > 1 && (
                <div className="main-content mt-4">
                <Container>
                <div style={upgradeInfo}>
                  <h1>Premium Mint</h1>
                  <Link to="/upgrade" style={decNone}>
                    <button style={yellowOrangeButtonStyle} onClick={() => handlePayment(premiumPlan, 'Premium')}>Activate</button>
                  </Link>
                </div>
                <span className='fw-bold' style={{color: '#FFA500'}}>₦{formatCurrency(premiumPlan, 2)}</span>
                  
                  <div className='d-flex align-items-start mt-4'>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <p className='mx-2'>Starts with mint rate of <span style={big} className='fw-bold'>{formatCurrency(0.09 / 1.8, 2)}/second</span></p>
                  </div>
                  <div className='d-flex align-items-start'>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <p className='mx-2'>Automatically get upgraded to Level 5</p>
                  </div>
                  <div className='d-flex align-items-start '>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <p className='mx-2'>Could be upgraded up to Level 9</p>
                  </div>
                </Container>
                </div>
        )}

        {/* third box */}
        {ultimatePlan > 1 && (
               <div className="main-content mt-4">
               <Container>
               <div style={upgradeInfo}>
                 <h1>Ultimate Mint</h1>
                 <Link to="/upgrade" style={decNone}>
                   <button style={yellowOrangeButtonStyle} onClick={() => handlePayment(ultimatePlan, 'Ultimate')}>Activate</button>
                 </Link>
               </div>
               <span className='fw-bold' style={{color: '#FFA500'}}>₦{formatCurrency(ultimatePlan, 2)}</span>
                 
                 <div className='d-flex align-items-start mt-4'>
                   <FontAwesomeIcon icon={faInfoCircle} />
                   <p className='mx-2'>Starts with mint rate of <span style={big} className='fw-bold'>{formatCurrency(0.14 / 1.8, 2)}/second</span></p>
                 </div>
                 <div className='d-flex align-items-start'>
                   <FontAwesomeIcon icon={faInfoCircle} />
                   <p className='mx-2'>Automatically get upgraded to Level 10</p>
                 </div>
                 <div className='d-flex align-items-start '>
                   <FontAwesomeIcon icon={faInfoCircle} />
                   <p className='mx-2'>Could be upgraded up to Level 15 <span className='fw-bold'>(max level)</span></p>
                 </div>
               </Container>
               </div>
        )}
   
   </div>
  
      
  );
}

export default UpgradeMint;