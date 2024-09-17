import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../functionalComponents/UserRoleContext';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import AdminTaskApproval from '../adminComponents/AdminTaskApproval';
import useCurrencyConverter from '../functionalComponents/useCurrencyConverter';

const TransactionList = () => {
  const { userData } = useUser();
  const userID = userData ? userData._id : '';
  const userRole = userData?.role || 'user';
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch transactions for the logged-in user
    const fetchTransactions = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const response = await axios.get(`https://mintingpro.onrender.com/api/transactions`, {
          params: { userID } // Pass userID as query parameter
        });

        // Sort transactions by timestamp in descending order
        const sortedTransactions = response.data.transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTransactions(sortedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    if (userID) {
      fetchTransactions(); // Only fetch transactions if userID is available
    }
  }, [userID]);




  const scrollContainer = {
    paddingBottom: '80px',
    paddingTop: '20px',
    minHeight: '100vh',
    boxSizing: 'border-box',
    background: 'linear-gradient(to bottom, #3c3f4c, #262A36)',
  };

  const txContainer = {
    height: '600px',
    overflowY: 'scroll',
  };

  const txContent = {
    background: '#4A4D61',
    color: '#fff',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
  };

  const leftContent = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    padding: '10px',
  };

  const bigBold = {
    fontSize: '20px',
    fontWeight: 'bold',
  };

  const rightContent = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
    padding: '10px',
  };

  return (
    <div style={scrollContainer} className='pTop-80'>
      <div className="main-content" style={txContainer}>
        <Container>
          <h1 className='text-center'>Transactions</h1>

          {userData !== null && userRole === 'admin' ? (
            <AdminTaskApproval />
          ):
          (
            loading ? (
              <div className="text-center">
                <FontAwesomeIcon icon={faSpinner} spin style={{ color: '#fff', marginTop: '20px' }} />
                <p style={{ color: '#fff', marginTop: '10px' }}>Loading transactions...</p>
              </div>
            ) :  transactions.length === 0 ? (
              // Display message when no transactions are available
              <div className="text-center">
                <p style={{ color: '#fff', marginTop: '20px' }}>No transactions available.</p>
              </div>
            ) :(
              // Loop through transactions once loading is complete
              transactions.map((tx) => (
                <div key={tx._id} style={txContent} className='flex-column-reverse flex-md-row'>
                  <div style={leftContent}>
                    <span>{tx.transactionType.charAt(0).toUpperCase() + tx.transactionType.slice(1)}</span>
                    {tx.description && <span>{tx.description}</span>}
                    <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                    <span>{tx.transactionReference}</span>
                  </div>
  
                  <div style={rightContent}>
                  <span style={bigBold} className={tx.transactionType === 'debit' ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                  {tx.paymentMethod === 'token_transfer' ? (
                    tx.transactionType === 'debit' ? `- ${(tx.amount / 1.8).toLocaleString()}` : `+ ${(tx.amount / 1.8).toLocaleString()}`
                  ) : (
                    tx.transactionType === 'debit' ? `- ₦${tx.amount.toLocaleString()}` : `+ ₦${tx.amount.toLocaleString()}`
                  )}
                  </span>
                  {tx.paymentMethod === 'token_transfer' && (
                   <span>₦{tx.amount.toLocaleString()}</span>
                  )}
                  </div>
  
                </div>
              ))
            )
          )}
        </Container>
      </div>
    </div>
  );
};

export default TransactionList;
