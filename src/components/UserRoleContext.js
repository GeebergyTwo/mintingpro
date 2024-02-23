// FirebaseContext.js

import { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import {auth, realTimeDb, db} from '../firebase';
import { onAuthStateChanged } from 'firebase/auth'; 
import { doc, addDoc, getDoc, updateDoc, collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { data } from 'jquery';
import { ToastContainer, toast } from "react-toastify";

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
  const user = auth.currentUser;

  const [task, setTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([null]);
  const isTaskCompleted = completedTasks.includes(task?.taskID);



  useEffect(() => {

 
    // Listen to changes in the user role
    onAuthStateChanged(auth, (user) =>{
      
      if(user !== null){
        const userRoleRef = ref(realTimeDb, `users/${user.uid}`); // Replace with your Firebase database path
        onValue(userRoleRef, (snapshot) => {
          const val = snapshot.val();
          const keys = Object.keys(val);
          const avatar = val[keys[0]];
          const email = val[keys[1]];
          const fullName = val[keys[2]];
          const ID = val[keys[3]];
          const phoneNo = val[keys[4]];
          const role = val[keys[5]];
          setUserImg(avatar);
          setUserEmail(email);
          setUserFullName(fullName);
          setUserID(ID);
          setUserPhoneNo(phoneNo);
          setUserRole(role);
      });

          // fetching user balance
    // Fetch the user's balance
    const fetchUserBalance = async () => {
      try {
        const userBalanceRef = doc(db, 'users', user.uid); // Assuming 'users' is your collection name
        const userBalanceSnapshot = await getDoc(userBalanceRef);
        if (userBalanceSnapshot.exists()) {
          const userBalanceData = userBalanceSnapshot.data();

          const dailyDropBalance = userBalanceSnapshot.data().dailyDropBalance;
          const ReferralsBalance = userBalanceSnapshot.data().referralsBalance;
          const totalDepositBalance = userBalanceSnapshot.data().deposit;
          const adRevenue = userBalanceSnapshot.data().adRevenue;

          if(adRevenue){
            const newBalance = parseFloat(dailyDropBalance) + parseFloat(ReferralsBalance) + parseFloat(adRevenue);

            await updateDoc(userBalanceRef, {
              balance: newBalance,
            });
          }
          else{
            const newBalance = parseFloat(dailyDropBalance) + parseFloat(ReferralsBalance);

            await updateDoc(userBalanceRef, {
              balance: newBalance,
            });
          }

          setUserBalance(userBalanceData.balance);
          setAccountLimit(userBalanceData.AccountLimit);
        }
      } catch (error) {
        console.error('Error fetching user balance:', error);
      }
    };

    
    const updateAccountLimit = async () => {
      // Fetch the user's document
      const userSnapshot = await getDoc(doc(db, 'users', user.uid));
      // Get the referredBy user's ID from the current user's document
      const referredByUserId = userSnapshot.data().referredBy;
      if(referredByUserId !== 'none'){
        try {
          if (!userSnapshot.exists()) {
            throw new Error('User data not found.');
          }
      
          
      
          // Fetch the referredBy user's document
          const referredByUserSnapshot = await getDoc(doc(db, 'users', referredByUserId));
      
          if (!referredByUserSnapshot.exists()) {
            throw new Error('ReferredBy user data not found.');
          }
      
          const referredByUserData = referredByUserSnapshot.data();
          const userData = userSnapshot.data();
      
          // Define account limit, activity, and referral count from the referredBy user
          const referrerId = referredByUserData.id;
          const userID = userData.id;
          const currentAccountLimit = referredByUserData.AccountLimit;
          const isAccountActive = referredByUserData.isAccountActive;
          const referralsCount = referredByUserData.referralsCount;
          const hasUserPaid = referredByUserData.hasPaid;

          
      
          const amount = 4500;
          const userRef = doc(db, 'users', referrerId);
          const currentUserRef = doc(db, 'users', userID);
      
          // Check if the user has three referrals and isAccountActive
          if (referralsCount >= 3 && isAccountActive && hasUserPaid) {
            await updateDoc(userRef, { AccountLimit: parseFloat(currentAccountLimit) + parseFloat(amount), referralsCount: 0, hasPaid: false });
          }

          
      
      
          // Fetch the user's balance after potential update
          const updatedAccountLimitSnapshot = await getDoc(userRef);
      
          if (!updatedAccountLimitSnapshot.exists()) {
            throw new Error('User data not found after update.');
          }
      
          
  

        } catch (error) {
          console.error('Error updating account limit:', error.message);
        }
      }
      else{
        try{
          // Fetch the user's document
          const userSnapshot = await getDoc(doc(db, 'users', user.uid));
          const userData = userSnapshot.data();
          const userID = userData.id;
          const amount = 4500;
          const currentUserRef = doc(db, 'users', userID);

          const currentUserAccountLimit = userData.AccountLimit;
          const isCurrentAccountActive = userData.isAccountActive;
          const currentUserReferralsCount = userData.referralsCount;
          const currentUserPaid = userData.hasPaid;

          if (currentUserReferralsCount >= 3 && isCurrentAccountActive && currentUserPaid) {
            await updateDoc(currentUserRef, { AccountLimit: parseFloat(currentUserAccountLimit) + parseFloat(amount), referralsCount: 0, hasPaid: false });
          }
        }
        catch(error){
          console.error('Error updating account limit:', error.message);
        }
      }
    };

    const updateCurrentAccountLimit = async () =>{
      try{
        // Fetch the user's document
      const userSnapshot = await getDoc(doc(db, 'users', user.uid));
      const currentUserRef = doc(db, 'users', userID);
      if(userSnapshot !== null){
        // record last login
      await updateDoc(currentUserRef, { lastLogin: new Date(),});
      if(!userSnapshot.data().adRevenue){
        await updateDoc(currentUserRef, { adRevenue: 0,});
      }
      // Update user balance in the context
      setAccountLimit(userSnapshot.data().AccountLimit);
      setReferralsBalance(userSnapshot.data().referralsBalance);
      setDailyDropBalance(userSnapshot.data().dailyDropBalance);
      setIsUserActive(userSnapshot.data().isAccountActive);
      setReferralsCount(userSnapshot.data().referralsCount);
      setTotalReferrals(userSnapshot.data().totalReferrals);
      setReferralCode(userSnapshot.data().referralCode);
      setHasPaid(userSnapshot.data().hasPaid);
      setReferredUsers(userSnapshot.data().referredUsers);
      setAdRevenue(userSnapshot.data().adRevenue);
      }


      }
      catch(error){
        console.log('Error updating current account limit:', error.message)
      }
    }

    // Fetch the user's balance
    updateCurrentAccountLimit();
    fetchUserBalance(); // Assuming fetchUserBalance is defined somewhere in your code
    updateAccountLimit();
    

      }
    }) 
  }, [userBalance, accountLimit, isTaskCompleted, userID, task]);

  return (
    <FirebaseContext.Provider value={{userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue }}>
      {children}
      <ToastContainer />
    </FirebaseContext.Provider>
  );
};
