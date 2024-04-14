import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Accordion, Button, Table} from 'react-bootstrap';
import { useFirebase } from './UserRoleContext';
import {auth, db} from '../firebase';
import {doc, getDoc, updateDoc, getFirestore, collection, addDoc} from 'firebase/firestore';
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import BtcWithdrawList from './btcWithdraw';
import "react-toastify/dist/ReactToastify.css";
import myRedImage from '../red-loader.gif';
import Loading from './Loading';




const WalletBalance = (props) => {
const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, slots, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, currencySymbol, country} = useFirebase();

const user = auth.currentUser;

const [isLoading, setIsLoading] = useState(false);
const [recipientName, setRecipientName] = useState('');           
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [txReference, setTxReference] = useState('');
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [inUseReference, setInUseReference] = useState('');
  const [transferResponse, setTransferResponse] = useState('');
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [fundAmount, setFundAmount] = useState(null);
   // Example non-decimal number
  // State to manage the selected value of the dropdown
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedStarterValue, setSelectedStarterValue] = useState('');

  const generateTransactionReference = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let customReference = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        customReference += characters[randomIndex];
    }
    return customReference;
    }
    
    const [paymentAddress, setPaymentAddress] = useState('');
    const formattedBalance  = (Number(userBalance) + 0.0).toFixed(2);
  

  //  save crypto transaction (deposit)
//  save crypto transaction (deposit)
const saveBtcTransactionData = async (transactionReference, email, amount, userID, status, transactionType, paymentID) => {
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
      transactionType,
      paymentID,
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
        console.log('Error adding transaction document: ', JSON.stringify(error));
      }
    })
    .catch(error => {
      console.log('Error:', JSON.stringify(error.message));
    });
  }
  
};
// end of crypto tx record

// save temp crypto tx
const saveTempCryptoData = async (userID, payment_id, payment_status, pay_address, price_amount, order_description) => {
  // const db = getFirestore();
  // const transactionsCollection = collection(db, 'transactions');
  // const txID = uuidv4(); 
  if(user){
    const paymentData = {
      userID,
      payment_id,
      payment_status,
      pay_address,
      price_amount,
      order_description
    };
    await fetch(`https://dripdash.onrender.com/api/saveCryptoPayments`,
   {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any other headers as needed
    },
    body: JSON.stringify(paymentData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
    })
    .then(data => {
      try {
        
    
      } catch (error) {
        
      }
    })
    .catch(error => {
      
    });
  }
  
};

  
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
     })
     .catch(error => {
       
     });
 }


  // Function to handle the change of the dropdown value
  const handleDropdownChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleCryptoDropdownChange = (event) => {
    setSelectedStarterValue(event.target.value);
  };


  const completeBtcPayment = () => {
    getUserDetail(userID);
    setIsLoading(true);
    if(selectedValue.trim() === ''){
      setIsLoading(false);
      toast.error(`Select a withdrawal option!`, {
        toastId: 'toast-wt-fail1',
      });
    }
    else if(userBalance < amount){
      setIsLoading(false);
      toast.error(`Insufficient Funds!`, {
        toastId: 'toast-wt-fail',
      });
    }
    else if(amount < 20){
      setIsLoading(false);
      toast.error(`Minimum withdrawal is $20!`, {
        toastId: 'toast-wt-fail2',
      });
    }
    else if(selectedValue === 'crypto' && selectedStarterValue.trim() === ''){
      setIsLoading(false);
      toast.error(`select a cryptocurrency!`, {
        toastId: 'toast-wt-fail3',
      });
    }
    else if(userAddress.trim() === ''){
      setIsLoading(false);
      toast.error(`receving account field cannot be empty!`, {
        toastId: 'toast-wt-fail4',
      });
    }
    else{

      const txReference = generateTransactionReference(10); // Assuming you want a reference of length 10
    const paymentID = generateTransactionReference(10); // Assuming you want a payment ID of length 10

    saveBtcTransactionData(txReference, userEmail, amount, userID, 'pending', 'Withdrawal', `pID-${paymentID}`);
    saveTempCryptoData(userID, `pID-${paymentID}`, 'pending', userAddress, amount, 'Crypto Withdrawal');
    setIsLoading(false);
    setIsBtnDisabled(false);
    debitUser(amount);
    }
  }
  // debit user
  
const debitUser = (ticketFee) =>{
  setIsLoading(true);
  getUserDetail(userID);
  if (userBalance >= ticketFee && ticketFee !== null){
      const addParticipant = async () => {
          try {
              await fetch('https://dripdash.onrender.com/api/addParticipant', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userId: userID,
                      fee: ticketFee // Example user ID
                      // Other user information...
                  }),
              });
              // next function
              setIsLoading(false);
              toast.success(`Request Submitted - Check transactions for more Info!`, {
                toastId: 'toast-submit-success',
              });

          } catch (error) {
              console.error('Error adding participant:', error);
              setIsLoading(false);
              toast.error(`Failed to make withdrawal!`, {
                  toastId: 'toast-add-failed',
              });
          }
      };
      addParticipant();
      
  }
  else{
      setIsLoading(false);
      toast.error(`Insufficient Funds!`, {
          toastId: 'toast-fund-failed',
      });
  }
}


  return (
    <div className='container-fluid' style={{ background: '#13151b', height: '100%', width: '100%', position: 'absolute', overflowY: 'auto', overflowX: 'hidden', marginBottom: '80px' }}>
         <ToastContainer />
      {/* User Details */}
      <Row className="mt-4" style={{ width: '85%', marginLeft: '16.5%', marginRight: '3.5%'}}>
      <h4 className='text-secondary'>Withdrawals</h4>
        <Col>
          <Card className='text-secondary' style={{background: '#1F222D', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>
            <Card.Body>
              <Card.Title>Net balance: <span className='text-white'>${formattedBalance}</span></Card.Title>
              <Card.Text>
             
              </Card.Text>
            </Card.Body>
          </Card>
          {/*  */}
          <Card className='text-secondary mt-4 mb-3' style={{background: '#1F222D', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>
            <Card.Body>
              <Card.Title>Make withdrawals</Card.Title>
              <Card.Text>
              <>
                    
                    {selectedValue === 'crypto' && <p className='text-danger'>Make sure to paste a {selectedStarterValue} wallet address!</p>}
                    
                
                    {/* select withdrawal from */}
                    <div>
                      <select className='form-control mt-4' id="myDropdown" value={selectedValue} onChange={handleDropdownChange}>
                        <option value="">Select Withdrawal Option</option>
                        <option value="bank">Withdraw to bank</option>
                        <option value="crypto">Withdraw to wallet</option>
                      </select>
                      </div>

                    {/* amount form */}
                    <div>
                    <input
                      type="number"
                      value={amount}
                      placeholder='Amount'
                      onChange={(e) => setAmount(e.target.value)}
                      className='form-control mt-4'
                    />
                  </div>
                  
                  

                  {/* paste address form */}
                  {selectedValue === 'crypto' && 
                    <>

                  <div className='mt-1'>
                    <select className='form-control mt-4 mb-3' id="myCryptoDropdown" value={selectedStarterValue} onChange={handleCryptoDropdownChange}>
                      <option value="">Select Payment Option</option>
                      <option value="btc">Bitcoin</option>
                      <option value="eth">Ethereum</option>
                      <option value="xrp">Ripple</option>
                    </select>
                  </div>
                  
                    </>
                  }
                  
                  {selectedValue.trim() !== '' && 
                    <div>
                    <input
                      type="text"
                      value={userAddress}
                      placeholder={`${selectedValue === 'crypto' && selectedValue.trim() !== '' ? 'Paste your bitcoin wallet address' : 'Bank Name'}`}
                      onChange={(e) => setUserAddress(e.target.value)}
                      className='form-control mt-4'
                    />
                  </div>
                  }
                  {selectedValue === 'bank' &&
                  <>
                    <div>
                    <input
                      type="text"
                      placeholder='Account Name'
                      className='form-control mt-4'
                    />
                  </div>
                  {/* account number */}
                  <div>
                    <input
                      type="number"
                      placeholder='Account Number'
                      className='form-control mt-4'
                    />
                  </div>
                  {/* routing number */}
                  <div>
                    <input
                      type="number"
                      placeholder='Routing Number'
                      className='form-control mt-4'
                    />
                  </div>
                  </>
                  }

                  {/* withdraw button */}
                  <button onClick={completeBtcPayment}  className={`btn-theme text-center mx-auto mb-5 mt-4 ${isBtnDisabled ? 'disabled' : ''}`}>Withdraw</button> <br/>
                  {selectedValue === 'crypto' && <>
                    <span className='fw-bold text-white'>Dont have a crypto wallet address:</span> <br/>
                    <a href='https://www.coinbase.com/' className='text-white'>Open a coinbase account</a> <br/>
                    <a href='https://www.blockchain.com/' className='text-white'>Open a blockchain account</a>
                  </>}
                    </>
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className='text-secondary mt-4 mb-3' style={{background: '#1F222D', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>
            <Card.Text className='p-5'>
              <p>
              Please note: Before approving a withdrawal request, you may be required to submit proof of identity and address of the requester. Withdrawal fees will be applied, based on type of trading account and acceptable withdrawal method. Withdrawals are normaly processed, using the same method as deposit was done. For security reasons, withdrawal requests to ewallets, bank and creditcard accounts, not belonging to a trading account owner are denied. Please refer to terms and conditions for more information.
              </p>
            </Card.Text>
          </Card>
        </Col>
      </Row>

      {isLoading && <Loading />}
    </div>
  );
  
};

export default WalletBalance;
