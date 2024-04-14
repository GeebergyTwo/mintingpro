import React, { useState, useEffect } from 'react';
import { useFirebase } from './UserRoleContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import BtcFundingList from './btcTaskFund';
import "react-toastify/dist/ReactToastify.css";

const TransactionList = () => {
  const { userImg, userEmail, userID, userRole } = useFirebase();
  const [userTransactions, setUserTransactions] = useState([]);

  useEffect(() => {
    // Fetch the user's transactions when the component mounts
    fetchUserTransactions(userID);
  }, [userID]);

  const fetchUserTransactions = async (userID) => {
    try {
      const response = await fetch(`https://dripdash.onrender.com/api/getUserTransactions?userID=${userID}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userTransactionsData = await response.json();

      // Sort transactions in ascending order based on a timestamp field
      userTransactionsData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setUserTransactions(userTransactionsData);
    } catch (error) {
      console.error('Error fetching user transactions: ', error);
    }
  };
  // Render the userTransactions in your component

  return (
    <div className='tx' style={{ background: '#13151b', height: '100%', width: '100%', position: 'absolute', overflowY: 'auto', overflowX: 'hidden', marginBottom: '80px' }}>
      <ToastContainer />
    <h2 className='fixed-top mx-auto text-center p-2 text-theme mx-5' style={{background: '#1F222D',}}>Your Transactions</h2>
    <div className="transaction-list container p-4" style={{ width: '82.5%', marginLeft: '15%', marginRight: '5%', background: '#1F222D', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>
      {userRole === 'crypto-checker' ? (
        <BtcFundingList />
      ) : (
        <>
      {userTransactions.map((transaction, index) => (
        <div key={index}
        className={transaction.status === 'success' ? 'alert alert-success mt-2' : transaction.status === 'pending' ? 'alert alert-warning mt-2' : 'alert alert-danger mt-2'}>
          <div className="transaction-reference"><span className='bold'>Transaction Reference:</span> {transaction.transactionReference}</div>
          <div className="tx-type bold">{transaction.transactionType}</div>
          <div className="transaction-details d-flex justify-content-between">
            {/* Display other transaction details here */}
            <span>
              Transaction {
                transaction.status === 'success' ? 'Successful' :
                transaction.status === 'pending' ? 'Pending' :
                'Failed'
              }
            </span> <span>Amount: <span className='bold'>${transaction.amount}</span></span>
          </div>
        </div>
      ))}
        </>
      )}
    </div>
    </div>
  );
};

export default TransactionList;
