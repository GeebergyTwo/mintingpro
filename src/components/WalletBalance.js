import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useFirebase } from './UserRoleContext';
import {auth, db} from '../firebase';
import {doc, getDoc, updateDoc, getFirestore, collection, addDoc} from 'firebase/firestore';
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import myRedImage from '../red-loader.gif';




const WalletBalance = (props) => {
const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue } = useFirebase();

const [showWithdrawForm, setShowWithdrawForm] = useState(false);
const [isBtnLoading, setIsBtnLoading] = useState(false);

const handleShowWithdrawForm = () => setShowWithdrawForm(true);
const handleCloseWithdrawForm = () => setShowWithdrawForm(false);

const user = auth.currentUser;

const [recipientName, setRecipientName] = useState('');           
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [inUseReference, setInUseReference] = useState('');
  const [transferResponse, setTransferResponse] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [newReferralsBalance, setNewReferralsBalance] = useState('');
  const [newAccountLimit, setNewAccountLimit] = useState('');
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  
  // State to manage the selected value of the dropdown
  const [selectedValue, setSelectedValue] = useState('');

  
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
  const reference = uuidv4();
  
  const initializeTooltip = (element) => {
    if (element) {
      const tooltip = new window.bootstrap.Tooltip(element, {
        placement: 'top', // Adjust placement as needed
        title: element.title,
      });
    }
  };
  const tooltipRef = useRef();
  const tooltipTitle = `Referred users must activate their accounts to get a confirmed referral. ${referredUsers !== undefined && referredUsers !== null ? `You currently have ${referredUsers} unconfirmed referrals`: ''}`;

  const secondToolTipRef = useRef();
  const secondToolTipTitle = `Funds from your ad balance can only withdrawn at the end of the month from the 28th to 30th.`;

  useEffect(() => {
    initializeTooltip(tooltipRef.current);
  }, [referredUsers]);

  useEffect(() => {
    initializeTooltip(secondToolTipRef.current);
  }, [referredUsers]);

  const [isAccountValid, setIsAccountValid] = useState(false);
 

  const handleAccountNumberChange = async (e) => {
    const newAccountNumber = e.target.value;
    setAccountNumber(newAccountNumber);

          // Find the selected bank code
          const selectedBankObject = bankList.find(
            (bank) => bank.name === selectedBank
          );
    
          if (!selectedBankObject) {
            console.error('Selected bank not found in the bank list');
            return;
          }
    
          const newBankCode = selectedBankObject.code;

    // Fetch account details and update recipientName
    if (newAccountNumber.length >= 10) {
      try {
        const paystackKey = 'sk_live_748347880c6e8c5da1635aec4b211ea3aecb2123';
        const verifyAccountResponse = await axios.get(
          `https://api.paystack.co/bank/resolve?account_number=${newAccountNumber}&bank_code=${newBankCode}`,
          {
            headers: {
              Authorization: `Bearer ${paystackKey}`,
            },
          }
        );

        if (verifyAccountResponse.data.status) {
          setRecipientName(verifyAccountResponse.data.data.account_name);
          setIsAccountValid(true);
        } else {
          setRecipientName('');
          setIsAccountValid(false);
        }
      } catch (error) {
        console.error('Error verifying account:', error);
        setRecipientName('');
        setIsAccountValid(false);
      }
    } else {
      setRecipientName('');
      setIsAccountValid(false);
    }
  };

 
  


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
        transactionType: 'Withdrawal',
        recipient: recipientName,
        account_number: accountNumber,
        selectedBank: selectedBank
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

  useEffect(() => {
    // Fetch list of Nigerian banks
    const fetchBanks = async () => {
      try {
        const response = await axios.get(
          'https://api.paystack.co/bank'
        );

        setBankList(response.data.data);
      } catch (error) {
        console.error('Error fetching banks:', error.response);
      }
    };

    fetchBanks();
  }, []);

  // accountLimit check
  const handleWithdrawal = () => {
        // Check if withdrawalAmount is a valid number
        getUserDetail(userID);
        setIsBtnLoading(true);
        setIsBtnDisabled(true);
        if (isNaN(amount)) {
          toast.warning(`Please enter a valid withdrawal amount.`, {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsBtnLoading(false);
          setIsBtnDisabled(false);
          return;
        }
        if(selectedValue === 'adBalance'){
            // Get the current date
          const currentDate = new Date();

         // Get the day of the month
         const dayOfMonth = currentDate.getDate();

         // Check if the day is between the 29th and 30th
        //  
        //    if(amount > adRevenue){
        //     toast.warning(`Insufficient Funds`, {
        //       position: toast.POSITION.TOP_CENTER,
        //     });
        //    }
        //  setIsBtnLoading(false);
        //    else{
        //     handleTransfer();
        //    }
           
        //  } 
        if (dayOfMonth >= 28 && dayOfMonth <= 30) {
          if(amount > adRevenue && adRevenue !== null){
            toast.warning(`Insufficient Funds`, {
              position: toast.POSITION.TOP_CENTER,
            });
            setIsBtnLoading(false);
            setIsBtnDisabled(false);
           }
           else if(amount < 500 && userRole !== 'admin'){
            toast.warning(`Minimum withdrawal amount is ₦500`, {
              position: toast.POSITION.TOP_CENTER,
            });
            setIsBtnLoading(false);
            setIsBtnDisabled(false);
          }
           else{
            handleTransfer();
           }
           
         }
         else {
          toast.warning(`Funds from your ad balance can only withdrawn at the end of the month from the 28th to 30th.`, {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsBtnLoading(false);
          setIsBtnDisabled(false);
         }
        }
        else if(selectedValue === 'bonusBalance'){
          if(amount > referralsBalance && referralsBalance !== null){
            toast.warning(`Insufficient Funds`, {
              position: toast.POSITION.TOP_CENTER,
            });
            setIsBtnLoading(false);
            setIsBtnDisabled(false);
           }
           else if(amount < 500 && userRole !== 'admin'){
            toast.warning(`Minimum withdrawal amount is ₦500`, {
              position: toast.POSITION.TOP_CENTER,
            });
            setIsBtnLoading(false);
            setIsBtnDisabled(false);
          }
           else{
            handleTransfer();
           }
           
        }
        else{
          if (accountLimit !== null && dailyDropBalance !== null){
      
          if (amount > accountLimit) {
            // Alert about reaching the account limit
            toast.warning(`Account Limit reached. You can only withdraw ₦${accountLimit} from your drop balance.${!hasPaid ? 'Reactivate your account' : ''}  ${!hasPaid && referralsCount < 3 ? 'and' : ''} ${referralsCount < 3 ? 'get at least three referrals' : ''}  to increase account limit.`, {
              position: toast.POSITION.TOP_CENTER,
              style: { width: '100%' }, // Adjust the width as needed
            });
            
            setIsBtnLoading(false);
            setIsBtnDisabled(false);
          } else if(amount > dailyDropBalance) {
            // Call a function or perform further actions
            toast.error(`Insufficient Funds`, {
              position: toast.POSITION.TOP_CENTER,
            });
            setIsBtnLoading(false);
            setIsBtnDisabled(false);
          }
          else if(amount < 500 && userRole !== 'admin'){
            toast.warning(`Minimum withdrawal amount is ₦500`, {
              position: toast.POSITION.TOP_CENTER,
            });
            setIsBtnLoading(false);
            setIsBtnDisabled(false);
          }
          else{
            handleTransfer();
          }
          }
        }
  };
  // end of accountLimit check

  // debit user function
  const debitUser = async () =>{
    const user = auth.currentUser;


    if(selectedValue === 'adBalance'){
      const newAdBalance = parseFloat(adRevenue) - parseFloat(amount);

      if (user) {
        const userDetails = {
          userId: userID,
          adRevenue: newAdBalance,
        };
    
        try {
          const response = await fetch("https://dripdash.onrender.com/api/updateOnDebit", {
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

      saveTransactionData(reference, userEmail, amount, userID, 'success');

      setIsBtnLoading(false);

      getUserDetail(userID);

      toast.success('Withdrawal Successful', {
        position: toast.POSITION.TOP_CENTER,
      });

      

       /* eslint-disable no-restricted-globals */
       setTimeout(() => {
        location.reload(true);
      }, 3000);
      /* eslint-enable no-restricted-globals */

    }
    else if(selectedValue === 'bonusBalance'){
      if (accountLimit !== null && referralsBalance !== null){
  
      const updatedReferralsBalance = parseFloat(referralsBalance) - parseFloat(amount);

        // update the dailydropbalance, accountlimit,referralsBalance
        // checking
        
      if (user) {
        const userDetails = {
          userId: userID,
          referralsBalance: updatedReferralsBalance,
        };
    
        try {
          const response = await fetch("https://dripdash.onrender.com/api/updateOnDebit", {
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
  

        saveTransactionData(reference, userEmail, amount, userID, 'success');

        setIsBtnLoading(false);

        getUserDetail(userID);

        toast.success('Withdrawal Successful', {
          position: toast.POSITION.TOP_CENTER,
        });
  
         /* eslint-disable no-restricted-globals */
         setTimeout(() => {
          location.reload(true);
        }, 3000);
        /* eslint-enable no-restricted-globals */
  


      }
    }
    else{
             
        const newDailyDropBalance = parseFloat(dailyDropBalance) - parseFloat(amount);
        const newAccountLimit = parseFloat(accountLimit) - parseFloat(amount);
        // for daily drops to update account limit

        if (user) {
          const userDetails = {
            userId: userID,
            dailyDropBalance: newDailyDropBalance,
            accountLimit: newAccountLimit,
          };
      
          try {
            const response = await fetch("https://dripdash.onrender.com/api/updateOnDebit", {
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


        saveTransactionData(reference, userEmail, amount, userID, 'success');

        setIsBtnLoading(false);

        getUserDetail(userID);

        toast.success('Withdrawal Successful', {
          position: toast.POSITION.TOP_CENTER,
        });

         /* eslint-disable no-restricted-globals */
         setTimeout(() => {
          location.reload(true);
        }, 3000);
        /* eslint-enable no-restricted-globals */


      
    
    }
    
  }
  // end of debit user function
  const handleTransfer = async () => {
    try {
      const paystackKey = 'sk_live_748347880c6e8c5da1635aec4b211ea3aecb2123';

      

      // Find the selected bank code
      const selectedBankObject = bankList.find(
        (bank) => bank.name === selectedBank
      );

      if (!selectedBankObject) {
        console.error('Selected bank not found in the bank list');
        toast.warning('Selected bank not found in the bank list', {
          position: toast.POSITION.TOP_CENTER,
        });
        setIsBtnLoading(false);
        setIsBtnDisabled(false);
        return;
      }

      const bankCode = selectedBankObject.code;

      // Create a recipient for the transfer
      const createRecipientResponse = await axios.post(
        'https://api.paystack.co/transferrecipient',
        {
          type: 'nuban',
          name: recipientName,
          account_number: accountNumber,
          bank_code: bankCode,
          currency: 'NGN',
        },
        {
          headers: {
            Authorization: `Bearer ${paystackKey}`,
          },
        }
      );

      // console.log('Recipient created:', createRecipientResponse.data);

      const recipientCode = createRecipientResponse.data.data.recipient_code;
      const percentageCut = 0 * amount;
      const percentageCutAmount = parseFloat(amount) - parseFloat(percentageCut);
      const description = 'DRIPDASH';

      // Initiate the transfer
      const initiateTransferResponse = await axios.post(
        'https://api.paystack.co/transfer',
        {
          source: 'balance',
          reason: description || 'Payment',
          amount: percentageCutAmount * 100, // Paystack API requires the amount in kobo
          recipient: recipientCode,
          reference: 'tx-' + reference,
        },
        {
          headers: {
            Authorization: `Bearer ${paystackKey}`,
          },
        }
      );

      setTransferResponse(initiateTransferResponse.data);
      debitUser();
    } catch (error) {
      console.error('Error initiating transfer:', error.response.data);
      toast.warning('Withdrawal not completed: Please confirm your details and try again', {
        position: toast.POSITION.TOP_CENTER,
      });
      setIsBtnLoading(false);
      setIsBtnDisabled(false);
    }
  };

  return (
    <>
    <ToastContainer />
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Withdraw</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  
                <div>
        
                <div>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className='form-control mt-4'
                  >
                    <option value="" disabled>
                      Select a Bank
                    </option>
                    {bankList.map((bank) => (
                      <option key={bank.id} value={bank.name}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                
        <input
          type="text"
          value={accountNumber}
          placeholder='Account Number'
          onChange={ handleAccountNumberChange}
          className='form-control mt-4'
        />
      </div>
        <input
          type="text"
          value={recipientName}
          placeholder='Recipient Name'
          onChange={(e) => setRecipientName(e.target.value)}
          className='form-control mt-4'
          disabled
          readOnly
        />
      </div>

      {/* select withdrawal from */}
      <div>
      <select className='form-control mt-4' id="myDropdown" value={selectedValue} onChange={handleDropdownChange}>
        <option value="">Select an option</option>
        <option value="adBalance">Withdraw From Ad Balance</option>
        <option value="bonusBalance">Withdraw From Bonus Balance</option>
        <option value="walletBalance">Withdraw From Wallet Balance</option>
      </select>
      </div>
      {/* amount pick */}

      <div>
        <input
          type="text"
          value={amount}
          placeholder='Amount'
          onChange={(e) => setAmount(e.target.value)}
          className='form-control mt-4'
        />
      </div>
    
                </div>
                <div className=' text-secondary d-flex text-center mt-4'>
              <span className='mx-1'>    <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-info-circle"
                viewBox="0 0 16 16"
             >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              </span>
              <span>
                <p>Withdrawals are processed within 24 hrs</p>
              </span>

              </div>
              </form>
            </div>
           
            <button onClick={handleWithdrawal}  className={`btn-theme text-center mx-auto mb-5 mt-0 ${isBtnDisabled ? 'disabled' : ''}`}>
            {isBtnLoading ? (
                 <img src={myRedImage} alt="Loading" width="20" height="20" />
             ) : (
              <>Withdraw</>
             )}</button>
            
            
          </div>
        </div>
      </div>
    {/* okay */}
    
    <div className='whole-wallet-container p-5'>
    <div className="wallet-balance-container fixed-top">
      <div className="wallet-header">
        <h2>Your Wallet Balance</h2>
      </div>

      <div className="wallet-balance">
        <div className="balance-amount">
          <span className="currency-symbol">₦</span>
          <span className="balance-value display-5">{userBalance}</span>
        </div>
        <div>
          {/* Your other content */}
          <button className="add-funds-button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Withdraw
          </button>

        </div>
      </div>
        <button className={`my-4 mb-4 btn-theme ${hasPaid ? 'd-none' : ''}`}><Link to='/activate_account'>Activate Account</Link></button>
        
      
    </div>

    <div className="container scrollable-container mt-5">
      <div className="row scrollable-content bonus-boxes">
        <div className="co-3 mb-3">
          <div className="card custom-card">
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-currency-exchange" viewBox="0 0 16 16">
               <path d="M0 5a5.002 5.002 0 0 0 4.027 4.905 6.46 6.46 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05c0-.046 0-.093.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.46 3.46 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98c-.003.046-.003.097-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5zm16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zm-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787H8.25zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674l.077.018z"/>
              </svg>
              <span className='mx-2'>Daily Drop Bonus</span></h5>
              <p className="card-text display-5">₦{dailyDropBalance}</p>
            </div>
          </div>
        </div>

        <div className="co-3 mb-3">
          <div className="card custom-card">
            <div className="card-body">
            <h5 className="card-title d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-cash-coin" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
              <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z"/>
             <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z"/>
             <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z"/>
            </svg>
              <span className='mx-2'>Bonus Balance</span></h5>
              <p className="card-text display-5">₦{referralsBalance}</p>
            </div>
          </div>
        </div>

        <div className="co-3 mb-3">
          <div className="card custom-card">
            <div className="card-body">
            <div className="d-flex align-items-end justify-content-between">
              <h5 className="card-title d-flex align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
            </svg>
              <span className='mx-2'>Confirmed Referrals</span></h5>
              <button type="button" ref={tooltipRef} className="btn custom-tooltip" data-bs-toggle="tooltip" data-placement="top" title={tooltipTitle}  data-html="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-info-circle"
                viewBox="0 0 16 16"
             >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              </button>
            </div>
              <p className="card-text display-5">{totalReferrals }</p>
            </div>
          </div>
        </div>

      {/* ads box */}
      <div className="co-3 mb-3">
          <div className="card custom-card">
            <div className="card-body">
            <div className="d-flex align-items-end justify-content-between">

              
            </div>
             <div className='d-flex align-items-end justify-content-between'>
             <h5 className="card-title d-flex align-items-center">

            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-piggy-bank-fill" viewBox="0 0 16 16">
            <           path d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069q0-.218-.02-.431c.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a1 1 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.74.74 0 0 0-.375.562c-.024.243.082.48.32.654a2 2 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595m7.173 3.876a.6.6 0 0 1-.098.21l-.044-.025c-.146-.09-.157-.175-.152-.223a.24.24 0 0 1 .117-.173c.049-.027.08-.021.113.012a.2.2 0 0 1 .064.199m-8.999-.65a.5.5 0 1 1-.276-.96A7.6 7.6 0 0 1 7.964 3.5c.763 0 1.497.11 2.18.315a.5.5 0 1 1-.287.958A6.6 6.6 0 0 0 7.964 4.5c-.64 0-1.255.09-1.826.254ZM5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0"/>
            </svg>

              <span className='mx-2'>Ad Bonus</span>
              <button type="button" ref={secondToolTipRef} className="btn custom-tooltip" data-bs-toggle="tooltip" data-placement="top" title={secondToolTipTitle}  data-html="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-info-circle"
                viewBox="0 0 16 16"
            >
               <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
               <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              </button>
              </h5>
             </div>
              <p className="card-text display-5">₦{adRevenue}</p>

             
            </div>
          </div>
        </div>

      </div>
      <span className='d-flex text-center swipe-txt'>
        <p className='sm-text'>Swipe for more account details</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
</      svg>
        </span>
    </div>
    </div>
    
    </>
  );
  
};

export default WalletBalance;
