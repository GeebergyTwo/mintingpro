// FirebaseContext.js

import { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import {auth, realTimeDb, db} from '../firebase';
import { onAuthStateChanged } from 'firebase/auth'; 
import { doc, addDoc, getDoc, updateDoc, collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { data } from 'jquery';
import { ToastContainer, toast } from "react-toastify";
import { getSuggestedQuery } from '@testing-library/react';

const FirebaseContext = createContext(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export const FirebaseProvider = ({ children }) => {

  const [userImg, setUserImg] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userFullName, setUserFullName] = useState(null);
  const [userID, setUserID] = useState(null);
  const [userPhoneNo, setUserPhoneNo] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userBalance, setUserBalance] = useState(null); // Initialize the balance
  const [accountLimit, setAccountLimit] = useState(null); // Initialize the balance
  const [referralsBalance, setReferralsBalance] = useState(null);
  const [isUserActive, setIsUserActive] = useState(null);
  const [dailyDropBalance, setDailyDropBalance] = useState(null);
  const [referralsCount, setReferralsCount] = useState(null);
  const [totalReferrals, setTotalReferrals] = useState(null);
  const [adRevenue, setAdRevenue] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [hasPaid, setHasPaid] = useState(null);
  const [referredUsers, setReferredUsers] = useState(null);
  const [deposit, setDeposit] = useState(null);
  const [isUserAnonymous, setIsUserAnonymous] = useState(null);
  const [slots, setSlots] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState(null);
  const [country, setCountry] = useState(null);
  const user = auth.currentUser;




const handleUpdateAccountLimit = async () => {
  if (user) {
    const userDetails = {
      userId: user.uid,
    };

    try {
      const response = await fetch("https://broker-base.onrender.com/api/updateAccountLimit", {
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
};
 




  useEffect(() => {

 

    onAuthStateChanged(auth, (user) =>{
    // confirm user existence
    if(user){
      // getUserDetails
      const userIdentify = user.uid;
      const userUid = user.uid;

const getUserDetail = async (userIdentify) => {
   await fetch(`https://broker-base.onrender.com/api/userDetail/${userIdentify}`)
   .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return response.json();
    })
    .then(data => {
      
      setUserImg(data.avatar);
      setUserEmail(data.email);
      setUserFullName(data.name);
      setUserID(data.userId);
      setUserPhoneNo(data.number);
      setUserRole(data.role);
      setAccountLimit(data.accountLimit);
     setReferralsBalance(data.referralsBalance);
     setDailyDropBalance(data.dailyDropBalance);
      setIsUserActive(data.isUserActive);
      setReferralsCount(data.referralsCount);
      setTotalReferrals(data.totalReferrals);
      setReferralCode(data.referralCode);
      setHasPaid(data.hasPaid);
      setReferredUsers(data.referredUsers);
      setAdRevenue(data.adRevenue);
      setDeposit(data.deposit);
      setIsUserAnonymous(data.isAnonymous);
      setSlots(data.slots);
      setCurrencySymbol(data.currencySymbol);
      setCountry(data.country);

      const newBalance = parseFloat(data.referralsBalance) + parseFloat(data.dailyDropBalance) + parseFloat(data.adRevenue);
      const updateBalance = async () => {
        if (user) {
          const userDetails = {
            userId: userIdentify,
            balance: newBalance,
            lastLogin: new Date(),
            firstLogin: false,
          };
      
          try {
            const response = await fetch("https://broker-base.onrender.com/api/updateBalance", {
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
      };
      
      updateBalance();
      setUserBalance(data.dailyDropBalance + data.referralsBalance + data.adRevenue);
    })
    .catch(error => {
      
    });
}

     
      // 
      const userIdentification = user.uid
      const doesUserExist = async () => {
      await fetch(`https://broker-base.onrender.com/api/userExists/${userIdentification}`)
       .then(response => {
         if (!response.ok) {
           throw new Error(`HTTP error! Status: ${response.status}`);
         }
         // setUsers(response)
         // console.log(response);
         return response.json();
       })
       .then(data => {
         
         if(data.status !== true){
          console.log('user does not exits');
    
         }
         else{
          // 
          
          onAuthStateChanged(auth, (user) =>{
            // confirm user existence
            if(user){
              getUserDetail(userIdentify);
              handleUpdateAccountLimit();
            }
          }) 
         }
       })
       .catch(error => {
         
       });
   }
    doesUserExist(userIdentification);
   
  }
}) 
    
  }, [userBalance, accountLimit, handleUpdateAccountLimit, userID]);


  return (
    <FirebaseContext.Provider value={{userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, slots, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, currencySymbol, country}}>
      {children}
      
      <ToastContainer />
    </FirebaseContext.Provider>
  );
};
