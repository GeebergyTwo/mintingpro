import React, { useState, useContext, useEffect } from 'react';
import { useFirebase } from './UserRoleContext';
import { doc, getDoc, updateDoc, getFirestore, collection, addDoc} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { data } from 'jquery';
import axios from 'axios';


const PaymentModal = () => {
  const amount = 3000; // Fixed amount
  const publicKey = 'pk_live_f27d2332cfd754cb3d37657e587bf209a8bb9c32';
  const user = auth.currentUser;
  const [userData, setUserData] = useState({});
  const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit} = useFirebase();
  const {txID, setTxId} = useState(null);

  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    checkPaymentStatus();
 }, []);

  const generateBitcoinAddress = async () => {
    try {
      const response = await axios.post('/api/bitcoin-address');
      setBitcoinAddress(response.data.address);
    } catch (error) {
      console.error('Error generating Bitcoin address:', error);
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(`/api/payment-status?address=${bitcoinAddress}`);
      setPaymentStatus(response.data.status);
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };


  const [email, setEmail] = useState(''); // Initialize email with user's email

  const getUserDetail = async (userID) => {
    await fetch(`https://dripdash.onrender.com/api/userDetail/${userID}`)
    .then(response => {
       if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}`);
       }
       
       return response.json();
     })
     .then(data => {
       
       setAccountLimit(data.accountLimit);
      setReferralsBalance(data.referralsBalance);
       setIsUserActive(data.isUserActive);
       setReferralsCount(data.referralsCount);
       setTotalReferrals(data.totalReferrals);
       setReferredUsers(data.referredUsers);
       setUserBalance(data.balance);
       setDeposit(data.deposit);
       setUserData(data);
     })
     .catch(error => {
       
     });
 }

  const saveTransactionData = async (transactionReference, email, amount, userID, status) => {
    // const db = getFirestore();
    // const transactionsCollection = collection(db, 'transactions');
    // const txID = uuidv4(); 
    if(user){
      const txDetails = {
        transactionReference: 'tx-' + transactionReference,
        email,
        amount,
        userID,
        status, // Include the status field
        timestamp: new Date(),
        transactionType: 'Deposit',
      };
      await fetch(`https://dripdash.onrender.com/api/createTransactions`,
     {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers as needed
      },
      body: JSON.stringify(txDetails),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        try {
      
      
        } catch (error) {
          console.error('Error adding transaction document: ', error);
        }
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
    }
    
  };

  // credit user for referral
  const updateAccountBalance = async () =>{
    creditReferrer(userID);
    getUserDetail(userID);
    const totalDeposit = parseFloat(deposit) + parseFloat(amount);
    const newDailyDropBalance = parseFloat(dailyDropBalance) + 7500;
    if(!isUserActive && deposit !== null && amount !== null){
      const userDetails = {
        userId: userID,
        deposit: totalDeposit,
        isUserActive: true,
        dailyDropBalance: newDailyDropBalance,
      };
  
      // 
      try {
        const response = await fetch("https://dripdash.onrender.com/api/updateInfoAfterPay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other headers as needed
          },
          body: JSON.stringify(userDetails),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
      } catch (error) {
        console.error("Error:", error.message);
      }
      getUserDetail(userID);
    }
    else if(deposit !== null && amount !== null){
      const userDetails = {
        userId: userID,
        deposit: totalDeposit,
      };
  
      // 
      try {
        const response = await fetch("https://dripdash.onrender.com/api/updateInfoAfterPay", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any other headers as needed
          },
          body: JSON.stringify(userDetails),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
      } catch (error) {
        console.error("Error:", error.message);
      }
      getUserDetail(userID);
    }
    
    
        
    
        
     
  //  
  }
// credit user for referral
const creditReferrer = async (userID) => {
  // Assuming you have the user ID of the current user
  await fetch(`https://dripdash.onrender.com/api/userDetail/${userID}`)
  .then(response => {
     if (!response.ok) {
       throw new Error(`HTTP error! Status: ${response.status}`);
     }
     
     return response.json();
   })
   .then(data => {
    
    const firstCredit = async () =>{
      // current user data
      const referredByUserID = data.referredBy;
      const referralRedeemed = data.referralRedeemed || false;
  
      await fetch(`https://dripdash.onrender.com/api/userDetail/${referredByUserID}`)
      .then(response => {
         if (!response.ok) {
           throw new Error(`HTTP error! Status: ${response.status}`);
         }
     
         return response.json();
       })
       .then(data => {
        const finalCredit = async () =>{
          // rferrer data

          const newReferralsCount = parseFloat(data.referralsCount) + 1;
          const newTotalReferrals = parseFloat(data.totalReferrals) + 1;
          const dailyDropBalance = parseFloat(data.dailyDropBalance);
          const newReferralsBalance = parseFloat(data.referralsBalance) + 500;
          const newBalance = parseFloat(dailyDropBalance) + parseFloat(newReferralsBalance);

          
if (referredByUserID && !referralRedeemed) {
  const userDetails = {
    userId: referredByUserID,
    referralsCount: newReferralsCount,
    totalReferrals: newTotalReferrals,
    balance: newBalance,
    referralsBalance: newReferralsBalance,

  };

  try {
    const response = await fetch("https://dripdash.onrender.com/api/creditReferrer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any other headers as needed
      },
      body: JSON.stringify(userDetails),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
  } catch (error) {
    console.error("Error:", error.message);
  }
}
  
        }

        finalCredit()
       })
       .catch(error => {
     
       });
       }

    firstCredit()
   })
   .catch(error => {
     console.log('refering error')
   });


};




  // end of referral credit
  
  const handlePayment = () => {
    const paystackOptions = {
      key: publicKey,
      email: email,
      amount: amount * 100, // Paystack uses amount in kobo (multiply by 100)
      ref: new Date().getTime(),
      callback: (response) => {
        if (response.status === 'success') {
          toast.success('Payment was successful!', {
            position: toast.POSITION.TOP_CENTER,
          });
  
          // Save successful transaction data to Firebase with status "success"
          saveTransactionData(response.reference, email, amount, userID, 'success');
          updateAccountBalance();
        
        } else {
          handleFailure(response);
        }
        
      },
      onClose: () => {
        handleFailure({ message: 'Payment was closed' });
      },
    };
  
    // Initialize Paystack
    const handler = window.PaystackPop.setup(paystackOptions);
    handler.openIframe();
  };
  
  const handleFailure = (error) => {
    toast.error('Payment failed: ' + error.message, {
      position: toast.POSITION.TOP_CENTER,
    });
  
    // Save failed transaction data to Firebase with status "failed"
    saveTransactionData('N/A', email, amount, userID, 'failed');
  };
  
  return (
    <div className="payment-container">
      <ToastContainer />
      <div className="payment-modal container">
        <h2>Deposit {userRole === 'crypto' ? 'Bitcoin' : 'Money'}</h2>
        <p className='tmn'>Amount: {userRole === 'crypto' ? '$5' : '₦3,000'}</p>

        {/* Add an input field for email */}
        {userRole === 'crypto' ? <>
        {bitcoinAddress && <p>Bitcoin Address: {bitcoinAddress}</p>}
        </>
        :
        <>
         <input
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        </>}

        <button className="paystack-button" onClick={userRole === 'crypto' ? generateBitcoinAddress : handlePayment}>
          Make Payment
        </button>
      </div>

    </div>
  );
};

export default PaymentModal;
