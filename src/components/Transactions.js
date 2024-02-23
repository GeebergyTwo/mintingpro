import React, { useState, useEffect } from 'react';
import { useFirebase } from './UserRoleContext';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TransactionList = () => {
  const { userImg, userEmail, userID } = useFirebase();
  const [userTransactions, setUserTransactions] = useState([]);

  useEffect(() => {
    // Fetch the user's transactions when the component mounts
    fetchUserTransactions(userID);
  }, [userID]);

  const fetchUserTransactions = async (userID) => {
    const db = getFirestore();
    const transactionsCollection = collection(db, 'transactions');
  
    // Create a query to filter transactions by the user's ID
    const userTransactionsQuery = query(transactionsCollection, where('userID', '==', userID));
  
    try {
      const userTransactionsSnapshot = await getDocs(userTransactionsQuery);
      const userTransactionsData = [];
  
      userTransactionsSnapshot.forEach((doc) => {
        userTransactionsData.push(doc.data());
      });
  
      // Sort transactions in chronological order based on a timestamp field (replace 'timestampField' with your actual timestamp field)
      userTransactionsData.sort((a, b) => b.timestamp - a.timestamp);
  
      setUserTransactions(userTransactionsData);
    } catch (error) {
      console.error('Error fetching user transactions: ', error);
    }
  };
  

  return (
    <div className='tx'>
      <ToastContainer />
    <h2 className='fixed-top mx-auto text-center bg-white p-2 text-theme mx-5'>Your Transactions</h2>
    <div className="transaction-list container p-4">
      
      {userTransactions.map((transaction, index) => (
        <div key={index}
        className={transaction.status === 'success' ? 'alert alert-success mt-2' : 'alert alert-danger mt-2'}>
          <div className="transaction-reference"><span className='bold'>Transaction Reference:</span> {transaction.transactionReference}</div>
          <div className="tx-type bold">{transaction.transactionType}</div>
          <div className="transaction-details d-flex justify-content-between">
            {/* Display other transaction details here */}
            <span>Transaction {transaction.status === 'success' ? 'Successful' : 'Failed'}</span> <span>Amount: ₦{transaction.amount}</span>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default TransactionList;
