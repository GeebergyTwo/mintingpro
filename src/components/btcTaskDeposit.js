import React, { useState, useEffect } from 'react';
import { useFirebase } from './UserRoleContext';
import { ToastContainer, toast } from "react-toastify";

const BtcTaskList = () => { // Rename the function to start with an uppercase letter
  const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, slots, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, currencySymbol, country } = useFirebase();
  const [tasks, setTasks] = useState([]);
  const [btcTx, setBtcTx] = useState([]);

  useEffect(() => {
    fetchPendingBtcDeposits();
  }, []);

  const fetchPendingBtcDeposits = async () => {
    try {
      const response = await fetch('https://broker-nel-app.onrender.com/api/getBtcDeposits');
      const transactions = await response.json();
      setBtcTx(transactions);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  // change state of btc tasks (transactions and temp data);
  const changePaymentStatus = async (transactionId, newStatus, userId) => {
    try {
      const response = await fetch(`https://broker-nel-app.onrender.com/api/updatePaymentStatusAndDelete/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStatus, userId }),
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
    <h1>Task Manager</h1>
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
        <button className='btn btn-success' onClick={() => changePaymentStatus(tx.payment_id, 'success', tx.userID)}>Mark as Approved</button>
        <button className='btn btn-danger' onClick={() => changePaymentStatus(tx.payment_id, 'failed', tx.userID)}>Mark as Declined</button>
        </div>
      </div>
    ))}
  </> 
    </div>
  </div>
  );
};

export default BtcTaskList;
