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

  const [task, setTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([null]);
  const [isTaskPending, setIsTaskPending] = useState(null);
  const [isTaskConfirmed, setIsTaskConfirmed] = useState(null);
  const [isTaskActuallyConfirmed, setIsTaskActuallyConfirmed] = useState(null);
  const [isTaskDeclined, setIsTaskDeclined] = useState(null);
  // task check two
  const [isTaskPendingTwo, setIsTaskPendingTwo] = useState(null);
  const [isTaskConfirmedTwo, setIsTaskConfirmedTwo] = useState(null);
  const [isTaskActuallyConfirmedTwo, setIsTaskActuallyConfirmedTwo] = useState(null);
  const [isTaskDeclinedTwo, setIsTaskDeclinedTwo] = useState(null);
  // task check three
  const [isTaskPendingThree, setIsTaskPendingThree] = useState(null);
  const [isTaskConfirmedThree, setIsTaskConfirmedThree] = useState(null);
  const [isTaskActuallyConfirmedThree, setIsTaskActuallyConfirmedThree] = useState(null);
  const [isTaskDeclinedThree, setIsTaskDeclinedThree] = useState(null);
  // task check four
  const [isTaskPendingFour, setIsTaskPendingFour] = useState(null);
  const [isTaskConfirmedFour, setIsTaskConfirmedFour] = useState(null);
  const [isTaskActuallyConfirmedFour, setIsTaskActuallyConfirmedFour] = useState(null);
  const [isTaskDeclinedFour, setIsTaskDeclinedFour] = useState(null);
  // task check five
  const [isTaskPendingFive, setIsTaskPendingFive] = useState(null);
  const [isTaskConfirmedFive, setIsTaskConfirmedFive] = useState(null);
  const [isTaskActuallyConfirmedFive, setIsTaskActuallyConfirmedFive] = useState(null);
  const [isTaskDeclinedFive, setIsTaskDeclinedFive] = useState(null);
  
  const user = auth.currentUser;

  const [activeTaskOne, setActiveTaskOne] = useState(null);
  const [activeTaskTwo, setActiveTaskTwo] = useState(null);
  const [activeTaskThree, setActiveTaskThree] = useState(null);
  const [activeTaskFour, setActiveTaskFour] = useState(null);
  const [activeTaskFive, setActiveTaskFive] = useState(null);



  useEffect(() => {
    const fetchActiveTasks = async () => {
      const taskIDs = ['activeTask_1', 'activeTask_2', 'activeTask_3', 'activeTask_4', 'activeTask_5'];

      // 

      for (let i = 0; i < taskIDs.length; i++) {
        try {
          const response = await fetch('https://dripdash.onrender.com/api/activeTasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskID: taskIDs[i] }),
          });

          const data = await response.json();

          if (data.success) {
            switch (i) {
              case 0:
                setActiveTaskOne(data.activeTask);
                break;
              case 1:
                setActiveTaskTwo(data.activeTask);
                break;
              case 2:
                setActiveTaskThree(data.activeTask);
                break;
              case 3:
                setActiveTaskFour(data.activeTask);
                break;
              case 4:
                setActiveTaskFive(data.activeTask);
                break;
              default:
                break;
            }
          } else {
           
          }
        } catch (error) {
          console.error('Error fetching active task:', error);
        }
      }
    };

    fetchActiveTasks();



  }, [isTaskPending, isTaskConfirmed]);
  
  
const createUser = async () => {
  if(user && accountLimit !== null && totalReferrals !== null){
    const userId = prev => prev + 1;
    const payLoad = {
      avatar: userImg,
      email: userEmail,
      name: userFullName,
      userId: user.uid,
      number: userPhoneNo,
      deposit,
      role: userRole,
      accountLimit,
      balance: userBalance || 0,
      referralsBalance,
      dailyDropBalance : dailyDropBalance || 7500,
      isUserActive,
      referralsCount,
      totalReferrals,
      referralCode,
      hasPaid,
      referredUsers,
      adRevenue: 0,
      firstLogin: true,
    }
    await fetch(`https://dripdash.onrender.com/api/addUser`,
   {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any other headers as needed
    },
    body: JSON.stringify(payLoad),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
  }
   
}




const handleUpdateAccountLimit = async () => {
  if (user) {
    const userDetails = {
      userId: user.uid,
    };

    try {
      const response = await fetch("https://dripdash.onrender.com/api/updateAccountLimit", {
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
   await fetch(`https://dripdash.onrender.com/api/userDetail/${userIdentify}`)
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
            const response = await fetch("https://dripdash.onrender.com/api/updateBalance", {
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
      setUserBalance(data.balance);
    })
    .catch(error => {
      
    });
}

//  TASK STATUS CHECK
// DEFINING
     //  CHECKING THE PENDING AND COMPLETED STATUS OF EACH AND EVERY TASK
     const checkTaskInPendingTasks = async (taskID, userID) => {
      if(user){
        const response = await fetch('https://dripdash.onrender.com/api/checkTaskInPendingTasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskID, userID: user.uid }),
      });
      const data = await response.json();
      return data.isTaskInPendingTasks;
      }
    
      
    };

    const checkTaskIsConfirmed = async (taskID, userID) => {
      if(user){
        const response = await fetch('https://dripdash.onrender.com/api/checkTaskIsConfirmed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskID, userID: user.uid }),
      });
      const data = await response.json();
      return data.isConfirmed;
      }
    
      
    };
    
    const checkDeclinedTasks = async (taskID, userID) => {
      if(user){
        const response = await fetch('https://dripdash.onrender.com/api/checkDeclinedTasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskID, userID: user.uid }),
      });
      const data = await response.json();
      return data.isDeclined;
      }
    
      
    };

    const checkTaskInCompletedTasks = async (taskID, userID) => {
     if(user){
      const response = await fetch('https://dripdash.onrender.com/api/checkTaskInCompletedTasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskID, userID: user.uid }),
      });
      const data = await response.json();
      return data.isTaskConfirmed;
     }
    
      
    };

    // END OF DEFINING


const checkAllTaskStatus = async () => {
  const tasks = ['activeTask_1', 'activeTask_2', 'activeTask_3', 'activeTask_4', 'activeTask_5'];

  try {
    const taskStatusPromises = tasks.map(async (task) => {
      const isTaskPending = await checkTaskInPendingTasks(task, userID);
      const isTaskConfirmed = await checkTaskInCompletedTasks(task, userID);
      const isTaskDeclined = await checkDeclinedTasks(task, userID);
      const isTaskReallyConfirmed = await checkTaskIsConfirmed(task, userID);

      return {
        task,
        isTaskPending,
        isTaskConfirmed,
        isTaskDeclined,
        isTaskReallyConfirmed,
      };
    });

    const taskStatusResults = await Promise.all(taskStatusPromises);

    // Now you have an array of task statuses, you can update state or handle them as needed
    taskStatusResults.forEach((result) => {
      const {
        task,
        isTaskPending,
        isTaskConfirmed,
        isTaskDeclined,
        isTaskReallyConfirmed,
      } = result;

      // Update state or handle the task status as needed
      switch (task) {
        case 'activeTask_1':
          setIsTaskActuallyConfirmed(isTaskReallyConfirmed);
          setIsTaskDeclined(isTaskDeclined);
          setIsTaskPending(isTaskPending);
          setIsTaskConfirmed(isTaskConfirmed);
          break;
        case 'activeTask_2':
          setIsTaskActuallyConfirmedTwo(isTaskReallyConfirmed);
          setIsTaskDeclinedTwo(isTaskDeclined);
          setIsTaskPendingTwo(isTaskPending);
          setIsTaskConfirmedTwo(isTaskConfirmed);
          // Repeat for other tasks
          break;
          // for three
          case 'activeTask_3':
          setIsTaskActuallyConfirmedThree(isTaskReallyConfirmed);
          setIsTaskDeclinedThree(isTaskDeclined);
          setIsTaskPendingThree(isTaskPending);
          setIsTaskConfirmedThree(isTaskConfirmed);
          break;
          // for four
          case 'activeTask_4':
          setIsTaskActuallyConfirmedFour(isTaskReallyConfirmed);
          setIsTaskDeclinedFour(isTaskDeclined);
          setIsTaskPendingFour(isTaskPending);
          setIsTaskConfirmedFour(isTaskConfirmed);
          break;
          // for five
          case 'activeTask_5':
          setIsTaskActuallyConfirmedFive(isTaskReallyConfirmed);
          setIsTaskDeclinedFive(isTaskDeclined);
          setIsTaskPendingFive(isTaskPending);
          setIsTaskConfirmedFive(isTaskConfirmed);
          break;
        // Repeat for other tasks
        default:
          break;
      }
    });
  } catch (error) {
    console.error('Error checking task status:', error);
  }
};



    const refreshCompletedTasks = async (userUid) => {
      if (user) {
        try {
          const response = await fetch(`https://dripdash.onrender.com/api/fetchCompletedTasks`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userUid }),
          });
      
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const completedTaskIds = await response.json();
          setCompletedTasks(completedTaskIds);
        } catch (error) {
          
        }
      }
       else{
        
       }
     };
     
      // 
      const userIdentification = user.uid
      const doesUserExist = async () => {
      await fetch(`https://dripdash.onrender.com/api/userExists/${userIdentification}`)
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
          
              // Listen to changes in the user role
    
      
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
        // 
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
          // 
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
          // 
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
      setDeposit(userSnapshot.data().deposit);
      }


      }
      catch(error){
        // 
      }
    }

    // Fetch the user's balance
    updateCurrentAccountLimit();
    fetchUserBalance(); // Assuming fetchUserBalance is defined somewhere in your code
    updateAccountLimit();
    createUser();    
    getUserDetail(userIdentify);
    checkAllTaskStatus();
    refreshCompletedTasks(userUid);
    handleUpdateAccountLimit();
    

      }
    
         }
         else{
          // 
          
          onAuthStateChanged(auth, (user) =>{
            // confirm user existence
            if(user){
              getUserDetail(userIdentify);
              checkAllTaskStatus();
              refreshCompletedTasks(userUid);
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
    
  }, [userBalance, accountLimit, activeTaskFive, activeTaskFour, activeTaskOne, activeTaskThree, activeTaskTwo,  createUser, handleUpdateAccountLimit, userID]);

  // trigger task notify
 // Your state variables here

 
// const triggerTaskStatusNotification = () => {
//   if (activeTaskOne || activeTaskTwo || activeTaskThree || activeTaskFour || activeTaskFive) {
//     const updateBonus = async (reward) => {
//       if (updateBonus.hasBonusBeenAdded) {
       
//         return;
//       }
  
//       const userDetails = {
//         userId: userID,
//         addAmount: true,
//         amountToAdd: reward,
//         bonusAdded: false, // Add a flag to track bonus addition
//       };
  
//       try {
//         const response = await fetch("https://dripdash.onrender.com/api/updateBonusAfterTask", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             // Add any other headers as needed
//           },
//           body: JSON.stringify(userDetails),
//         });
  
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
  
//         const data = await response.json();
  
//         // Set the flag to true to indicate that the bonus has been added
//         updateBonus.hasBonusBeenAdded = true;
//         userDetails.bonusAdded = true;
//       } catch (error) {
//         console.error("Error:", error.message);
//       }
      
//     };
  
//     // Initialize the flag
//     updateBonus.hasBonusBeenAdded = false;
  
//     // Rest of the code remains the same...
//     if (isTaskActuallyConfirmed || isTaskActuallyConfirmedTwo || isTaskActuallyConfirmedThree || isTaskActuallyConfirmedFour || isTaskActuallyConfirmedFive) {
//       // task one confirmed
//       if (isTaskActuallyConfirmed && activeTaskOne) {
//         updateBonus(activeTaskOne.reward);
//       } else {
        
//       }
  
//       // task two confirmed
//       if (isTaskActuallyConfirmedTwo && activeTaskTwo) {
//         updateBonus(activeTaskTwo.reward);
//       } else {
        
//       }
  
//       // task three confirmed
//       if (isTaskActuallyConfirmedThree && activeTaskThree) {
//         updateBonus(activeTaskThree.reward);
//       } else {
        
//       }
  
//       // task four confirmed
//       if (isTaskActuallyConfirmedFour && activeTaskFour) {
//         updateBonus(activeTaskFour.reward);
//       } else {
      
//       }
  
//       // task five confirmed
//       if (isTaskActuallyConfirmedFive && activeTaskFive) {
//         updateBonus(activeTaskFive.reward);
//       } else {
       
//       }
  
//       const notify = () => {
//         toast.success("Task Completed!", {
//           toastId: 'toast-task-success'
//         });
//       };
  
      
//       notify();
//     }
  
//     if (isTaskDeclined || isTaskDeclinedTwo || isTaskDeclinedThree || isTaskDeclinedFour || isTaskDeclinedFive) {
//       // Code to execute if at least one condition is true
//       const notify = () => {
//         toast.error("Task Failed!", {
//           toastId: 'toast-task-failed'
//         });
//       };
//       notify();
//     }
//   }
  
// };


//   // Call the function on component mount
//   triggerTaskStatusNotification();

//   // Subscribe to state changes to trigger the function again
//   const stateChangeHandler = () => {
//     triggerTaskStatusNotification();
//   };

//   // Add your state variables to the dependency array below
//   // This ensures that the effect re-runs whenever these state variables change
//     stateChangeHandler();

//   // Clean up the effect when the component unmounts
//   return () => {
//     // Cleanup code, if needed
//   };

// end of task notify


  return (
    <FirebaseContext.Provider value={{userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, isTaskConfirmed, setIsTaskConfirmed, isTaskPending, setIsTaskPending, completedTasks, setCompletedTasks, isTaskPendingTwo, setIsTaskPendingTwo, isTaskConfirmedTwo, setIsTaskConfirmedTwo,  isTaskPendingThree, setIsTaskPendingThree, isTaskConfirmedThree, setIsTaskConfirmedThree, isTaskPendingFour, setIsTaskPendingFour, isTaskConfirmedFour, setIsTaskConfirmedFour, isTaskPendingFive, setIsTaskPendingFive, isTaskConfirmedFive, setIsTaskConfirmedFive, isTaskDeclined, setIsTaskDeclined, isTaskDeclinedTwo, setIsTaskDeclinedTwo, isTaskDeclinedThree, setIsTaskDeclinedThree, isTaskDeclinedFour, setIsTaskDeclinedFour, isTaskDeclinedFive, setIsTaskDeclinedFive, isTaskActuallyConfirmed, setIsTaskActuallyConfirmed, isTaskActuallyConfirmedTwo, setIsTaskActuallyConfirmedTwo, isTaskActuallyConfirmedThree, setIsTaskActuallyConfirmedThree, isTaskActuallyConfirmedFour, setIsTaskActuallyConfirmedFour, isTaskActuallyConfirmedFive, setIsTaskActuallyConfirmedFive, activeTaskOne, setActiveTaskOne, activeTaskTwo, setActiveTaskTwo, activeTaskThree, setActiveTaskThree, activeTaskFour, setActiveTaskFour, activeTaskFive, setActiveTaskFive}}>
      {children}
      
      <ToastContainer />
    </FirebaseContext.Provider>
  );
};
