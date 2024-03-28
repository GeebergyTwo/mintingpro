import React, { useState, useEffect } from 'react';
import { Modal, Button, Tab, Tabs, Table } from 'react-bootstrap';
import {auth, db} from '../firebase';
import { useFirebase } from './UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import myRedImage from '../red-loader.gif';

const WeeklyWinnersModal = ({ showModal, onClose }) => {
    const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, slots, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue } = useFirebase();
    const [prizesAndWinners, setPrizesAndWinners] = useState([]);
    const [fundAmount, setFundAmount] = useState(null);
    const [isFundLoading, setIsFundLoading] = useState(null);
    const user = auth.currentUser;

    useEffect(() => {
        fetchPrizesAndWinners();
    }, []);

    const fetchPrizesAndWinners = async () => {
        try {
            const response = await fetch('https://dripdash.onrender.com/api/getPrizesAndWinners');
            if (!response.ok) {
                throw new Error('Failed to fetch prizes and winners');
            }
            const data = await response.json();
            setPrizesAndWinners(data);
        } catch (error) {
            console.error('Error fetching prizes and winners:', error);
        }
    };
    // 
    const joinRaffle = () =>{
        setIsFundLoading(true);
        getUserDetail(userID);
        const ticketFee = prizesAndWinners.currentRaffleFee;
        if (referralsBalance >= ticketFee && ticketFee !== null){
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
                    setIsFundLoading(false);
                    toast.success(`Raffle Joined`, {
                        toastId: 'toast-fund-success',
                    });

                } catch (error) {
                    console.error('Error adding participant:', error);
                    setIsFundLoading(false);
                    toast.error(`Failed to join raffle!`, {
                        toastId: 'toast-add-failed',
                    });
                }
            };
            addParticipant();
            
        }
        else{
            setIsFundLoading(false);
            toast.error(`Insufficient Funds! - Fund your Wallet to continue`, {
                toastId: 'toast-fund-failed',
            });
        }
    }
   
    // 
    const publicKey = 'pk_live_f27d2332cfd754cb3d37657e587bf209a8bb9c32';
  

  const saveTransactionFundData = async (transactionReference, email, amount, userID, status) => {
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

  const updateAccountBalance = async () =>{
    getUserDetail(userID);
      const newReferralsBalance = referralsBalance + fundAmount;
      const userDetails = {
        userId: userID,
        referralsBalance: newReferralsBalance
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
    
    
        
    
        
     
  //  
  }
  
  const handlePayment = () => {
    const paystackOptions = {
      key: publicKey,
      email: userEmail,
      amount: fundAmount * 100, // Paystack uses amount in kobo (multiply by 100)
      ref: new Date().getTime(),
      callback: (response) => {
        if (response.status === 'success') {
          toast.success('Payment was successful!', {
            position: toast.POSITION.TOP_CENTER,
          });
  
          // Save successful transaction data to Firebase with status "success"
          saveTransactionFundData(response.reference, userEmail, fundAmount, userID, 'success');
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
    saveTransactionFundData('N/A', userEmail, fundAmount, userID, 'failed');
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

// 


    return (
        <>
         <ToastContainer />
            <Modal show={showModal} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Weekly Winners</Modal.Title>
                </Modal.Header>
                <Modal.Body  style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
                    <Tabs defaultActiveKey="referral" id="weekly-winners-tabs">
                        <Tab eventKey="referral" title="Prize Winners">
                        <h6 className='mt-3 text-start'>
                           <span>This Week's Referral Prize:</span> <span className='text-theme'>₦{prizesAndWinners.currentPrize}</span>
                        </h6>
                        <h6 className='mt-1 text-start'>
                           <span>This Week's Ad Clicks Prize:</span> <span className='text-theme'>₦{prizesAndWinners.currentAdPrize}</span>
                        </h6>
                        <h6 className='text-theme mt-5'>Last Week's Winners</h6>
                            <Table striped bordered hover>
                                
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>User</th>
                                        <th>Prize</th>
                                    </tr>
                                </thead>
                                <tbody> 
            
                                    <tr>
                                        <td>For referrals</td>
                                        <td className={prizesAndWinners.topEarnerUsername === userFullName ? 'text-them bold' : ''}>{prizesAndWinners.topEarnerAnon ? 'Anonymous' : prizesAndWinners.topEarnerUsername}</td>
                                        <td>{prizesAndWinners.topEarnerLastPrize === 0 ? 'Pending' : ` ₦${prizesAndWinners.topEarnerLastPrize}`}</td>
                                    </tr>
                                    <tr>
                                    <td>For Ads</td>
                                    <td className={prizesAndWinners.topAdClickerUsername === userFullName ? 'text-theme bold' : ''}>{prizesAndWinners.topAdClickerAnon ? 'Anonymous' : prizesAndWinners.topAdClickerUsername}</td>
                                    <td>{prizesAndWinners.topAdClickerLastPrize === 0 ? 'Pending' : ` ₦${prizesAndWinners.topAdClickerLastPrize}`}</td>
                                </tr>
                                <tr>
                                        <td>For Raffle</td>
                                        <td className={prizesAndWinners.raffleWinnerUsername === userFullName ? 'text-theme bold' : ''}>{prizesAndWinners.raffleWinnerAnon ? 'Anonymous' : prizesAndWinners.raffleWinnerUsername}</td>
                                        <td>{prizesAndWinners.raffleWinnerLastPrize === 0 ? 'Pending' : ` ₦${prizesAndWinners.raffleWinnerLastPrize}`}</td>
                                    </tr>
                            
                                    {/* Display last week's referral contest winners and prizes */}
                                </tbody>
                            </Table>

                            {/* referral contest rules */}
                            <div className='text-start mt-5'>
                            <h6 className='text-theme'>Referral Contest Rules</h6>
                            <p>
                                <span className='bold'>To participate in the referral contest, follow these guidelines:</span>
                                <ul>
                                    <li>Share your unique referral link provided in your account dashboard with friends, family, and acquaintances.</li>
                                    <li>Your referrals must sign up for DripDash using your referral link.</li>
                                    <li>Only valid referrals will be counted towards your total. Valid referrals include new users who sign up for DripDash using your link and complete the registration process.</li>
                                    <li>Referrals must be genuine and from individuals who are not already registered with DripDash.</li>
                                    <li>Referring yourself or creating multiple accounts with your own email addresses is strictly prohibited.</li>
                                    <li>Referrals made using self-created emails or accounts will not be considered valid and may result in disqualification from the contest.</li>
                                    <li>The decision of the DripDash team regarding the validity of referrals is final.</li>
                                </ul>
                                Start referring today and stand a chance to win exciting prizes in our referral contest!
                            </p>
                            </div>

                        </Tab>
                        <Tab eventKey="raffle" title="Raffle Draw">
                        <h6 className='text-theme mt-3'>Join the Raffle</h6>
                            <p>Join our raffles for a chance to win big, as much as ₦200,000! When you participate, your ticket is grouped with others in your area, increasing your chances of winning. Don't miss out on the opportunity to win big!</p>
                            <p className='bold text-center'>This week's raffle ticket: ₦{prizesAndWinners.currentRaffleFee}</p>
                            <button className='btn-theme mx-auto' onClick={joinRaffle}>{isFundLoading ? <><img src={myRedImage} alt='loading-img' width="20" height="20"></img></> : 'Join the Raffle'}</button>
                            
                            <p className='mt-2'><span className='text-theme'>Your slots: </span> {slots}</p>

                            <p className='mt-4 text-start'><span className='bold'>Note: </span> The more slots you have in the raffle, the greater your chances of winning.</p>
                            {/*  */}
                            <div className='text-start mt-5'>
                             <h3 className='text-theme'>Raffle Rules:</h3>
                             <ol>
                                 <li><strong>Participation Fee:</strong> The fee for each raffle ticket will be deducted from your wallet balance (bonus balance).</li>
                                 <li><strong>Eligibility:</strong> To be eligible to join the raffle, you must have at least the ticket price available in your balance.</li>
                                 <li><strong>Insufficient Balance:</strong> If your balance is insufficient, you can fund your account to meet the ticket price.</li>
                                 <li><strong>Winners Selection:</strong> Winners will be selected randomly from all participants' tickets.</li>
                                 <li><strong>Prize Distribution:</strong> Prizes will be awarded to the selected winners accordingly.</li>
                             </ol>
                            </div>

                            {/*  */}
                            <div className='text-start mt-3'>
                            <h4 className='mb-3'>Fund your Wallet</h4>
                             <input
                            type="number"
                             placeholder="Enter amount"
                              className='border border-secondary rounded p-2'
                              value={fundAmount}
                              onChange={(e) => setFundAmount(e.target.value)}
                              // onChange={(e) => setEmail(e.target.value)}
                            />
                            <button className="btn-theme-default text-start p-2 mt-1 mt-3" onClick={handlePayment}>
                                Fund Wallet
                             </button>
                            </div>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default WeeklyWinnersModal;
