import React from 'react';
import { PaystackButton } from 'react-paystack';
import { useFirebase } from './UserRoleContext';
// import 'express';
// import 'body-parser';

const PaymentModal = () => {
  const amount = 3000; // Fixed amount
  const publicKey = `${process.env.PAYSTACK_PUBLIC_KEY}`;
  const { userImg, userEmail, userFullName, userID, userPhoneNo, userRole, userBalance, setUserBalance } = useFirebase();

  const handleSuccess = (response) => {
    if(response.status === 'success'){
      alert('Payment was successful!\nTransaction Reference: ' + response.reference);
      console.log('Payment was successful!', response);
    }
    else{
      handleFailure();
    }
  };
  
  const handleFailure = (error) => {
    alert('Payment failed: ' + error.message);
    console.error('Payment failed: ', error);
  };

  return (
    <div className="payment-container">
      <div className="payment-modal">
        <h2>Deposit Money</h2>
        <p className='tmn'>Amount: ₦3,000</p>
        <PaystackButton
          text="Make Payment"
          className="paystack-button"
          callback={handleSuccess}
          onClose={handleFailure}
          reference={new Date().getTime()}
          email={userEmail}
          amount={amount * 100} // Paystack uses amount in kobo (multiply by 100)
          publicKey={publicKey}
          tag="button"
        />
      </div>
    </div>
  );
};

export default PaymentModal;
