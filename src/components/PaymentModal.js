import React, { useState, useContext } from 'react';
import { useFirebase } from './UserRoleContext';
import { doc, getDoc, updateDoc, getFirestore, collection, addDoc} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const PaymentModal = () => {
  const amount = 3000; // Fixed amount
  const publicKey = 'pk_live_f27d2332cfd754cb3d37657e587bf209a8bb9c32';
  const user = auth.currentUser;
  const { userImg, userEmail, userFullName, userID, userPhoneNo, userRole, userBalance, setUserBalance, accountLimit, setAccountLimit, isUserActive, setIsUserActive } = useFirebase();

  const [email, setEmail] = useState(''); // Initialize email with user's email
  const saveTransactionData = async (transactionReference, email, amount, userID, status) => {
    const db = getFirestore();
    const transactionsCollection = collection(db, 'transactions');
  
    try {
      const docRef = await addDoc(transactionsCollection, {
        transactionReference,
        email,
        amount,
        userID,
        status, // Include the status field
        timestamp: new Date(),
        transactionType: 'Deposit',
      });
      
      console.log('Transaction document written with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding transaction document: ', error);
    }
  };


  const updateAccountBalance = async () =>{

   

    const balanceRef = doc(db, 'users', user.uid);
    const balanceSnapshot = await getDoc(balanceRef);
    // Update the user's balance in Firebase
    const userRef = doc(db, 'users', user.uid);
    const currentBalance = balanceSnapshot.data().balance;
    const totalDeposit = parseFloat(balanceSnapshot.data().deposit) + parseFloat(amount);
    const newBalance = currentBalance;

    const isAccountActive = balanceSnapshot.data().isAccountActive;
    
    if(!isAccountActive){
      await updateDoc(userRef, { isAccountActive: true});
      const isAccountActive = balanceSnapshot.data().isAccountActive;
      setIsUserActive(isAccountActive);
    }
    await updateDoc(userRef, { deposit: totalDeposit});
    await updateDoc(userRef, { balance: newBalance});
    await updateDoc(userRef, { hasPaid: true});


    
    if (balanceSnapshot.exists()) {
      const updatedBalance = balanceSnapshot.data().balance;
      
      // Update userBalance in the context
      setUserBalance(updatedBalance);
    }
  }

  // credit user for referral
// credit user for referral
const creditReferrer = async () => {
  // Assuming you have the user ID of the current user
  const currentUserID = user.uid; // Replace with the actual user ID

  // Get the current user's document
  const currentUserDocRef = doc(db, 'users', currentUserID);

  try {
    // Retrieve the referredBy and referralRedeemed fields from the current user's document
    const currentUserSnapshot = await getDoc(currentUserDocRef);
    const referredByUserID = currentUserSnapshot.data().referredBy;
    const referralRedeemed = currentUserSnapshot.data().referralRedeemed || false;

    if (referredByUserID && !referralRedeemed) {
      // Get the referring user's document
      const referringUserDocRef = doc(db, 'users', referredByUserID);
      const referringUserSnapshot = await getDoc(referringUserDocRef);

      if (referringUserSnapshot.exists()) {
        // Update the balance and referralsCount fields in the referring user's document
        const newReferralsCount = parseFloat(referringUserSnapshot.data().referralsCount) + 1;
        const newTotalReferrals = parseFloat(referringUserSnapshot.data().totalReferrals) + 1;
        const dailyDropBalance = parseFloat(referringUserSnapshot.data().dailyDropBalance);
        const newReferralsBalance = parseFloat(referringUserSnapshot.data().referralsBalance) + 500;
        const newBalance = parseFloat(dailyDropBalance) + parseFloat(newReferralsBalance);
        const newReferredUsers = parseFloat(referringUserSnapshot.data().referredUsers) - 1;

        await updateDoc(referringUserDocRef, {
          balance: newBalance,
          referralsCount: newReferralsCount,
          referralsBalance: newReferralsBalance,
          totalReferrals: newTotalReferrals,
          referredUsers: newReferredUsers,
        });

        console.log('Referring user updated successfully.');
      } else {
        console.log('Referring user not found.');
      }

      // Set referralRedeemed to true at the end
      await updateDoc(currentUserDocRef, {
        referralRedeemed: true,
      });
    } else if (referralRedeemed) {
      console.log('Referrer has already redeemed this bonus.');
    } else {
      console.log('No referral information found for the current user.');
    }
  } catch (error) {
    console.error('Error updating referring user:', error);
  }
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
          updateAccountBalance();
          saveTransactionData(response.reference, email, amount, userID, 'success');
          creditReferrer();
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
        <h2>Deposit Money</h2>
        <p className='tmn'>Amount: ₦3,000</p>

        {/* Add an input field for email */}
        <input
          type="text"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="paystack-button" onClick={handlePayment}>
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
