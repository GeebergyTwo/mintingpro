import React, { useState, useEffect } from 'react';
import { useFirebase } from './UserRoleContext';
import { ToastContainer, toast } from "react-toastify";

const BtcFundingList = () => { // Rename the function to start with an uppercase letter
  const {userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, slots, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, currencySymbol, country } = useFirebase();
  const [tasks, setTasks] = useState([]);
  const [btcTx, setBtcTx] = useState([]);

  useEffect(() => {
    fetchPendingBtcFundings();
  }, []);

  const fetchPendingBtcFundings = async () => {
    try {
      const response = await fetch('https://dripdash.onrender.com/api/getBtcFundings');
      const transactions = await response.json();
      setBtcTx(transactions);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  // change state of btc tasks (transactions and temp data);
  const updateUserBalance = async (transactionId, newStatus, userId, price_amount) => {
    try {
      const response = await fetch(`https://dripdash.onrender.com/api/updateUserBalance/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus, userId, price_amount }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // If the request is successful, call another function
      toast.success(`Documents Updated!`, {
        toastId: 'toast-change-success',
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error(`Failed to update documents!`, {
        toastId: 'toast-change-failed',
      });
    }
  };


  return (
    <div>
    <ToastContainer />
    <h1>BTC Funding Requests</h1>
    <div className="custom-task-list d-block">
  <>
    {btcTx.map((tx) => ( 
      <div key={tx.id} className="custom-task-card">
        {/* Display transaction details */}
        <p>Transaction ID: {tx.payment_id}</p>
        <p>Amount: {tx.price_amount}</p>
        <p>Status: {tx.payment_status}</p>
        <p>User ID: {tx.userID}</p>
        <p>Payment Description: {tx.order_description}</p>
        
        {/* Buttons to change payment status */}
        <div className='d-flex justify-content-between align-items-center'>
        <button className='btn btn-success' onClick={() => updateUserBalance(tx.payment_id, 'success', tx.userID, tx.price_amount)}>Mark as Approved</button>
        <button className='btn btn-danger' onClick={() => updateUserBalance(tx.payment_id, 'failed', tx.userID, tx.price_amount)}>Mark as Declined</button>
        </div>
      </div>
    ))}
  </> 
    </div>
  </div>
  );
};

export default BtcFundingList;
