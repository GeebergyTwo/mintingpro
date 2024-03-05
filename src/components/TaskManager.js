import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, storage, app as firebaseApp } from '../firebase';
import { getStorage, uploadBytesResumable, ref as databaseRef, getDownloadURL } from 'firebase/storage';
import { useFirebase } from './UserRoleContext';
import { onAuthStateChanged } from 'firebase/auth';
import myGreenImage from '../green-loader.gif';
import myRedImage from '../red-loader.gif';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from 'react-bootstrap';
import MyModal from './MyModal'; // Replace with the correct path

const TaskManager = () => {
  const [task, setTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pendingTaskCheck, setPendingTaskCheck] = useState(null);
  const [bonusTask, setBonusTask] = useState(null);
  const [alTask, setAlTask] = useState(null);
  const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, isTaskConfirmed, setIsTaskConfirmed, isTaskPending, setIsTaskPending, completedTasks, setCompletedTasks, isTaskPendingTwo, setIsTaskPendingTwo, isTaskConfirmedTwo, setIsTaskConfirmedTwo,  isTaskPendingThree, setIsTaskPendingThree, isTaskConfirmedThree, setIsTaskConfirmedThree, isTaskPendingFour, setIsTaskPendingFour, isTaskConfirmedFour, setIsTaskConfirmedFour, isTaskPendingFive, setIsTaskPendingFive, isTaskConfirmedFive, setIsTaskConfirmedFive,  isTaskDeclined, setIsTaskDeclined, isTaskDeclinedTwo, setIsTaskDeclinedTwo, isTaskDeclinedThree, setIsTaskDeclinedThree, isTaskDeclinedFour, setIsTaskDeclinedFour, isTaskDeclinedFive, setIsTaskDeclinedFive, isTaskActuallyConfirmed, setIsTaskActuallyConfirmed, isTaskActuallyConfirmedTwo, setIsTaskActuallyConfirmedTwo, isTaskActuallyConfirmedThree, setIsTaskActuallyConfirmedThree, isTaskActuallyConfirmedFour, setIsTaskActuallyConfirmedFour, isTaskActuallyConfirmedFive, setIsTaskActuallyConfirmedFive,  activeTaskOne, setActiveTaskOne, activeTaskTwo, setActiveTaskTwo, activeTaskThree, setActiveTaskThree, activeTaskFour, setActiveTaskFour, activeTaskFive, setActiveTaskFive } = useFirebase();
  const user = auth.currentUser;
  const [notification, setNotification] = useState(null);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [isBonusBtnLoading, setIsBonusBtnLoading] = useState(false);
  const [isAlLoading, setIsAlLoading] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [taskNumber, setTaskNumber] = useState(null);

  // task loader
  const [isTaskOneLoading, setIsTaskOneLoading] = useState(null);
  const [isTaskOneLoadingTwo, setIsTaskOneLoadingTwo] = useState(null);
  const [isTaskOneLoadingThree, setIsTaskOneLoadingThree] = useState(null);
  const [isTaskOneLoadingFour, setIsTaskOneLoadingFour] = useState(null);
  const [isTaskOneLoadingFive, setIsTaskOneLoadingFive] = useState(null);

  const isTaskCompleted = completedTasks.includes(task?.taskID);
  const isBonusTaskCompleted = completedTasks.includes(bonusTask?.taskID);
  const isAlTaskCompleted = completedTasks.includes(alTask?.taskID)
  const userUid = userID;



  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [isModalVisible, setModalVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');




  const userIdentify = userID;
const refreshUserDetail = async (userIdentify) => {
  await fetch(`http://localhost:3001/api/userDetail/${userIdentify}`)
  .then(response => {
     if (!response.ok) {
       throw new Error(`HTTP error! Status: ${response.status}`);
     }
     
     return response.json();
   })
   .then(data => {
     

     setAccountLimit(data.accountLimit);
    setReferralsBalance(data.referralsBalance);
    setDailyDropBalance(data.dailyDropBalance);
     setIsUserActive(data.isUserActive);
     setReferralsCount(data.referralsCount);
     setTotalReferrals(data.totalReferrals);
     setReferralCode(data.referralCode);
     setReferredUsers(data.referredUsers);
     setAdRevenue(data.adRevenue);
     setDeposit(data.deposit);

     const newBalance = parseFloat(data.referralsBalance) + parseFloat(data.dailyDropBalance) + parseFloat(data.adRevenue);
     const updateBalance = async () => {
       if (user) {
         const userDetails = {
           userId: userIdentify,
           balance: newBalance,
         };
     
         try {
           const response = await fetch("http://localhost:3001/api/updateBalance", {
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





  const triggerError = () => {
    try {
      // Simulating an error with a custom message
      throw new Error('Session filled up');
    } catch (error) {
      // Show modal with custom error message
      setErrorMessage({
        header: ` Session filled up`,
        body: 'Try again at 9:00 a.m.',
        innerBody: 'Best Regards, Drip Dash.',
        buttonText: 'Join a Whatsapp group near you to stay up to date',
        buttonLink: 'https://chat.whatsapp.com/Bx4lIRm15GF4xxRTNgg7vv', // Replace with your actual link
      });
      setModalVisibility(true);
    }
  };

  const closeModal = () => {
    setModalVisibility(false);
  };


  const handleShow = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  // Function to refresh completed tasks
  


  // UPLOAD PENDING TASKS WITH IMAGE FROM TASKS ONE THROUGH FIVE
  const handleFileChange = (event) => {
    setIsTaskLoading(true);
    setIsTaskOneLoading(true);
    setTimeout(() => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const reader = new FileReader();
  
  
        const storageRef = databaseRef(storage, 'images/' + userID);
  
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            console.log(error);
            setIsTaskLoading(false);
            setIsTaskOneLoading(false);
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const imageSrc = downloadURL;
              const writeImageData = async() =>{
                // Create a document in 'pendingTasks'
                try {
                  const response = await fetch('http://localhost:3001/api/addTaskForUser', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userID, // Replace with the actual user ID
                      imageSrc,
                      taskID: `activeTask_1`,
                      description: activeTaskOne.description, // Replace with the actual image source
                    }),
                  });
              
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
              
                  const data = await response.json();
                  /* eslint-disable no-restricted-globals */
                    setTimeout(() => {
                     location.reload(true);
                   }, 3000);
                   /* eslint-enable no-restricted-globals */
                } catch (error) {
                  console.error('Error adding task for user:', error.message);
                }
              };
              writeImageData();
    
            });
          }
        );
        //
        // 

        reader.readAsDataURL(selectedFile);
      }
      else{
        setIsTaskLoading(false);
        setIsTaskOneLoading(false);
      }
    }, 3000);
  };

  // TASK TWO
  const handleFileChangeTwo = (event) => {
    setIsTaskLoading(true);
    setIsTaskOneLoadingTwo(true);
    setTimeout(() => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const reader = new FileReader();
  
  
        const storageRef = databaseRef(storage, 'images/' + userID);
  
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            console.log(error);
            setIsTaskLoading(false);
            setIsTaskOneLoadingTwo(false);
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const imageSrc = downloadURL;
              const writeImageData = async() =>{
                // Create a document in 'pendingTasks'
                try {
                  const response = await fetch('http://localhost:3001/api/addTaskForUser', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userID, // Replace with the actual user ID
                      imageSrc,
                      taskID: `activeTask_2`,
                      description: activeTaskTwo.description, // Replace with the actual image source
                    }),
                  });
              
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
              
                  const data = await response.json();
                  /* eslint-disable no-restricted-globals */
                    setTimeout(() => {
                     location.reload(true);
                   }, 3000);
                   /* eslint-enable no-restricted-globals */
                } catch (error) {
                  console.error('Error adding task for user:', error.message);
                }
              };
              writeImageData();
    
            });
          }
        );
        //
        // 

        reader.readAsDataURL(selectedFile);
      }
      else{
        setIsTaskLoading(false);
        setIsTaskOneLoadingTwo(false);
      }
    }, 3000);
  };

  // TASK THREE
  const handleFileChangeThree = (event) => {
    setIsTaskLoading(true);
    setIsTaskOneLoadingThree(true);
    setTimeout(() => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const reader = new FileReader();
  
  
        const storageRef = databaseRef(storage, 'images/' + userID);
  
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            console.log(error);
            setIsTaskLoading(false);
            setIsTaskOneLoadingThree(false);
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const imageSrc = downloadURL;
              const writeImageData = async() =>{
                // Create a document in 'pendingTasks'
                try {
                  const response = await fetch('http://localhost:3001/api/addTaskForUser', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userID, // Replace with the actual user ID
                      imageSrc,
                      taskID: `activeTask_3`,
                      description: activeTaskThree.description, // Replace with the actual image source
                    }),
                  });
              
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
              
                  const data = await response.json();
                  /* eslint-disable no-restricted-globals */
                    setTimeout(() => {
                     location.reload(true);
                   }, 3000);
                   /* eslint-enable no-restricted-globals */
                } catch (error) {
                  console.error('Error adding task for user:', error.message);
                }
              };
              writeImageData();
    
            });
          }
        );
        //
        // 

        reader.readAsDataURL(selectedFile);
      }
      else{
        setIsTaskLoading(false);
        setIsTaskOneLoadingThree(false);
      }
    }, 3000);
  };

  // TASK FOUR
  const handleFileChangeFour = (event) => {
    setIsTaskLoading(true);
    setIsTaskOneLoadingFour(true);
    setTimeout(() => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const reader = new FileReader();
  
  
        const storageRef = databaseRef(storage, 'images/' + userID);
  
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            console.log(error);
            setIsTaskLoading(false);
            setIsTaskOneLoadingFour(false);
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const imageSrc = downloadURL;
              const writeImageData = async() =>{
                // Create a document in 'pendingTasks'
                try {
                  const response = await fetch('http://localhost:3001/api/addTaskForUser', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userID, // Replace with the actual user ID
                      imageSrc,
                      taskID: `activeTask_4`,
                      description: activeTaskFour.description, // Replace with the actual image source
                    }),
                  });
              
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
              
                  const data = await response.json();
                  /* eslint-disable no-restricted-globals */
                    setTimeout(() => {
                     location.reload(true);
                   }, 3000);
                   /* eslint-enable no-restricted-globals */
                } catch (error) {
                  console.error('Error adding task for user:', error.message);
                }
              };
              writeImageData();
    
            });
          }
        );
        //
        // 

        reader.readAsDataURL(selectedFile);
      }
      else{
        setIsTaskLoading(false);
        setIsTaskOneLoadingFour(false);
      }
    }, 3000);
  };

  // TASK FIVE
  const handleFileChangeFive = (event) => {
    setIsTaskLoading(true);
    setIsTaskOneLoadingFive(true);
    setTimeout(() => {
      const selectedFile = event.target.files[0];

      if (selectedFile) {
        const reader = new FileReader();
  
  
        const storageRef = databaseRef(storage, 'images/' + userID);
  
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          }, 
          (error) => {
            // Handle unsuccessful uploads
            console.log(error);
            setIsTaskLoading(false);
            setIsTaskOneLoadingFive(false);
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const imageSrc = downloadURL;
              const writeImageData = async() =>{
                // Create a document in 'pendingTasks'
                try {
                  const response = await fetch('http://localhost:3001/api/addTaskForUser', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      userID, // Replace with the actual user ID
                      imageSrc,
                      taskID: `activeTask_5`,
                      description: activeTaskFive.description, // Replace with the actual image source
                    }),
                  });
              
                  if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                  }
              
                  const data = await response.json();
                  /* eslint-disable no-restricted-globals */
                    setTimeout(() => {
                     location.reload(true);
                   }, 3000);
                   /* eslint-enable no-restricted-globals */
                } catch (error) {
                  console.error('Error adding task for user:', error.message);
                }
              };
              writeImageData();
    
            });
          }
        );
        //
        // 

        reader.readAsDataURL(selectedFile);
      }
      else{
        setIsTaskLoading(false);
        setIsTaskOneLoadingFive(false);
      }
    }, 3000);
  };

// END OF PENDING TASK CREATION
// click for ads
const handleClick = async () => {
  setIsAdLoading(true);
  // Array of links
  const links = ['https://www.profitablegatecpm.com/rrj7qu03i?key=b0a0109a1af36e994515ac7d52972914',];

  // Generate a random index
  const randomIndex = Math.floor(Math.random() * links.length);

  // Get the random link
  const randomLink = links[randomIndex];

  try{
    const updatedAdRevenue = adRevenue + 0.75;

    
      const userDetails = {
        userId: userID,
        adRevenue: updatedAdRevenue,
      };
  
      try {
        const response = await fetch("http://localhost:3001/api/updateOnDebit", {
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

    // Redirect the user
    window.location.href = randomLink;
   }
  catch(error){
    
  }
  
};


  // START OF DATA REWRITE
  useEffect(() => {
  
    // Generate the task ID for the current date in the format 'task-YYYYMMDD'
    const currentDate = new Date();
    const taskID = `task-${currentDate.getFullYear()}${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
  
    // Generate the bonus task ID using the same currentDate
    const bonusTaskID = `bonusTask-${currentDate.getFullYear()}${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;

      // account limit increase ID
      const aLTaskID = `aL-${currentDate.getFullYear()}${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
  
      
      // Your function to fetch and set the task
      async function fetchAndSetTask(taskID) {
        try {
          const response = await fetch(`http://localhost:3001/api/tasks/${taskID}`);
          const data = await response.json();

          if (data.success) {
            const task = data.task;
            setTask(task);
          } else {
            console.error('Failed to fetch task:', data.message);
          }
        } catch (error) {
          console.error('Error during fetch:', error);
          triggerError();
        }
      }

      // Example usage
     
  
    const fetchBonusTask = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/tasks/${bonusTaskID}`);
        const data = await response.json();

        if (data.success) {
          const task = data.task;
          setBonusTask(task);
        } else {
          console.error('Failed to fetch task:', data.message);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        triggerError();
      }
    };

    const accountBoost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/tasks/${aLTaskID}`);
        const data = await response.json();

        if (data.success) {
          const task = data.task;
          setAlTask(task);
        } else {
          console.error('Failed to fetch task:', data.message);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        triggerError();
      }
    };
  
      
  
    // Call both fetch functions
    fetchAndSetTask(taskID);
    fetchBonusTask();
    accountBoost();
  }, []);
  

  // START OF DATA REWRITE (TO FETCH DATA AGAIN)

  // START OF DATA REWRITE TO COMPLETE TASK ON CLICK
  const completeTask = async () => {
    setIsBtnLoading(true);
    refreshUserDetail(userIdentify);
    if (isTaskCompleted) {
      setIsBtnLoading(false);
      toast.warning('You have already completed this task.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  else if (user && task && completedTasks !== null) {
      // Fetch the reward amount from the task or any other location in your database
      
      // get and set user details
      const getUserDetail = async (userID) => {
        await fetch(`http://localhost:3001/api/userDetail/${userID}`)
        .then(response => {
           if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
           }
           
           return response.json();
         })
         .then(data => {
          const rewardAmount = task.reward;
          const dailyDropBalance = data.dailyDropBalance + rewardAmount;
          const referralsBalance = data.referralsBalance;
          const newBalance = dailyDropBalance + referralsBalance;
          
          const updateBalance = async () => {
            if (user) {
              const userDetails = {
                userId: userID,
                dailyDropBalance: dailyDropBalance,
                balance: newBalance,
              };
          
              try {
                const response = await fetch("http://localhost:3001/api/updateBalance", {
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
                refreshUserDetail(userIdentify);
              } catch (error) {
                console.error("Error:", error.message);
              }
            }
          };
          
          updateBalance();
         })
         .catch(error => {
          
         });
     }

     getUserDetail(userID);

      const userUuid = user.uid;
      const taskID = task.taskID;
      const markTaskAsCompleted = async (userUid, taskID) => {
        try {
          const response = await fetch(`http://localhost:3001/api/markTaskAsCompleted`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userUid, taskID }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
    
          setTimeout(() => {
            setIsBtnLoading(false);
            toast.success('Drop Collected!', {
            position: toast.POSITION.TOP_CENTER,
          });
          }, 2000);
        } catch (error) {
          console.error('Error marking task as completed:', error.message);
        }
      };
      markTaskAsCompleted(userUuid, taskID);      
      
      refreshUserDetail(userIdentify);
  
    
      // Refresh the completed tasks

    } 
  };


  // START OF DATA REWRITE TO COMPLETE BONUS TASK ON CLICK
  const completeBonusTask = async () => {
    setIsBonusBtnLoading(true);
    refreshUserDetail(userIdentify);
    if (isBonusTaskCompleted) {
      setIsBonusBtnLoading(false);
      toast.warning('You have already completed this task.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  else if (user && bonusTask && completedTasks !== null) {
        // Fetch the reward amount from the task or any other location in your database


      const getUserDetail = async (userID) => {
        await fetch(`http://localhost:3001/api/userDetail/${userID}`)
        .then(response => {
           if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
           }
           
           return response.json();
         })
         .then(data => {
          const rewardAmount = bonusTask.reward;
          const dailyDropBalance = data.dailyDropBalance + rewardAmount;
          const referralsBalance = data.referralsBalance;
          const newBalance = dailyDropBalance + referralsBalance;
          
          const updateBalance = async () => {
            if (user) {
              const userDetails = {
                userId: userID,
                dailyDropBalance: dailyDropBalance,
                balance: newBalance,
              };
          
              try {
                const response = await fetch("http://localhost:3001/api/updateBalance", {
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
                refreshUserDetail(userIdentify);
              } catch (error) {
                console.error("Error:", error.message);
              }
            }
          };
          
          updateBalance();
         })
         .catch(error => {
           
         });
     }

     getUserDetail(userID);

      const userUuid = user.uid;
      const taskID = bonusTask.taskID;
      const markTaskAsCompleted = async (userUid, taskID) => {
        try {
          const response = await fetch(`http://localhost:3001/api/markTaskAsCompleted`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userUid, taskID }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      

          
          setTimeout(() => {
            setIsBonusBtnLoading(false);
            toast.success('Drop Collected!', {
            position: toast.POSITION.TOP_CENTER,
          });
          }, 2000);
        } catch (error) {
          console.error('Error marking task as completed:', error.message);
        }
      };
      markTaskAsCompleted(userUuid, taskID);      
      
      refreshUserDetail(userIdentify);
  
    
      // Refresh the completed tasks
    } 

  };

  // complete AL task
  const completeAlTask = async () => {
    setIsAlLoading(true);
    refreshUserDetail(userIdentify);
    if (isAlTaskCompleted) {
      setIsAlLoading(false);
      toast.warning('You have already claimed this!', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  else if (user && alTask && completedTasks !== null) {
      // Fetch the reward amount from the task or any other location in your database
      
      // get and set user details
      const getUserDetail = async (userID) => {
        await fetch(`http://localhost:3001/api/userDetail/${userID}`)
        .then(response => {
           if (!response.ok) {
             throw new Error(`HTTP error! Status: ${response.status}`);
           }
           
           return response.json();
         })
         .then(data => {
          const rewardAmount = alTask.reward;
          const accountLimit = data.accountLimit + rewardAmount;
          const referralsBalance = data.referralsBalance;
          const newBalance = dailyDropBalance + referralsBalance;
          
          const updateBalance = async () => {
            if (user) {
              const userDetails = {
                userId: userID,
                dailyDropBalance: dailyDropBalance,
                accountLimit,
                balance: newBalance,
              };
          
              try {
                const response = await fetch("http://localhost:3001/api/updateBalance", {
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
                refreshUserDetail(userIdentify);
              } catch (error) {
                console.error("Error:", error.message);
              }
            }
          };
          
          updateBalance();
         })
         .catch(error => {
           
         });
     }

     getUserDetail(userID);

      const userUuid = user.uid;
      const taskID = alTask.taskID;
      const markTaskAsCompleted = async (userUid, taskID) => {
        try {
          const response = await fetch(`http://localhost:3001/api/markTaskAsCompleted`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userUid, taskID }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          setTimeout(() => {
            setIsAlLoading(false);
            toast.success('Account Limit Increased!', {
            position: toast.POSITION.TOP_CENTER,
          });
          }, 2000);
        } catch (error) {
          console.error('Error marking task as completed:', error.message);
        }
      };
      markTaskAsCompleted(userUuid, taskID);      
      
      refreshUserDetail(userIdentify);
  
    
      // Refresh the completed tasks

      
    } 
  };

  
  return (
    <div className='drop-list'>
       <ToastContainer />
       <MyModal showModal={showModal} handleClose={handleClose} />
       <Modal show={isModalVisible} onHide={closeModal}>
        <Modal.Header closeButton>
          <span className='d-flex align-items-center'><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-circle-fill text-warning mx-2" viewBox="0 0 16 16">
  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
</svg><Modal.Title>{errorMessage.header}</Modal.Title></span>
        </Modal.Header>
        <Modal.Body>
          <p>{errorMessage.body}</p>
          <p>{errorMessage.innerBody}</p>
        </Modal.Body>
        <Modal.Footer>
          {errorMessage.buttonLink && (
            <Button className='border border-success bg-light text-success bold' href={errorMessage.buttonLink} target="_blank">
              {errorMessage.buttonText}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      {user && isUserActive ? (
        <>
  
        {task && isTaskCompleted !== null && (
          <div className='d-flex justify-content-between i-task p-3'>
          <div className='first-part'>
          <p className='text-theme bold'>Claim your daily drop:</p>
          <p className=''>{task.description}</p>
          </div>
          <button id='myButton' className={`${task.description === 'bonus task' ? 'bonus-btn' : 'task-btn'} ${isBtnLoading ? 'disabled' : ''}`} onClick={completeTask}>
            {isBtnLoading ? (
                 <img src={myRedImage} alt="Loading" width="20" height="20" />
             ) : (
               <> 
               {isTaskCompleted ? (
                "Claimed"
               ) : (
                `+${task.reward || 200} Naira`
               )}
               </>
             )}
             
          </button>
        </div>
        )}
        {/* display bonus task */}
        {bonusTask && isBonusTaskCompleted !== null && (
          <div className='d-flex justify-content-between i-task p-3'>
            <div className='first-part'>
             <p className='text-theme bold'>Bonus Drop Available:</p>
             <p className=''>{bonusTask.description}</p>
            </div>
            <button
              id='myButton'
              className={`task-btn ${isBonusBtnLoading ? 'disabled' : ''}`}
              onClick={completeBonusTask}
            >
              
              {isBonusBtnLoading ? (
                  <img src={myRedImage} alt="Loading" width="20" height="20" />
               ) : (
                <>
                {isBonusTaskCompleted ? (
                  "Claimed"
                ) : (
                  `+${bonusTask.reward || 200} Naira`
                )}
              </>
               )}
            </button>
         </div>
        )}
        {/* account boost drops */}
        
        {alTask && isAlTaskCompleted !== null && (
          <div className='d-flex justify-content-between i-task p-3'>
          <div className='first-part'>
          <p className='text-theme bold'>Increase your account limit:</p>
          <p className=''>{alTask.description}</p>
          </div>
          <button id='myButton' className={`${alTask.description === 'bonus task' ? 'bonus-btn' : 'task-btn'} ${isAlLoading ? 'disabled' : ''}`} onClick={completeAlTask}>
            {isAlLoading ? (
                 <img src={myRedImage} alt="Loading" width="20" height="20" />
             ) : (
               <> 
               {isAlTaskCompleted ? (
                "Claimed"
               ) : (
                `+${alTask.reward || 200} Naira`
               )}
               </>
             )}
             
          </button>
        </div>
        )}
        {/* {display ads} */}
        <div className='d-flex justify-content-between i-task p-3'>
            <div className='first-part'>
             <p className='text-theme bold'>Check out ads:</p>
             <p className=''>Stay for at least five seconds after clicking to verify completion.</p>
             <p>Reward per ad view: <span className='text-theme bold'>+0.75</span></p>
            </div>
            <button
              id='myButton'
              className={`task-btn`}
              onClick={handleClick}
            >
              
              {isAdLoading ? (
                  <img src={myRedImage} alt="Loading" width="20" height="20" />
               ) : (
                <>
                  Check Out Ads
              </>
               )}
            </button>
         </div>
        {/* display else condition when the user has no tasks */}

        {/* display tasks */}
        <div>
        {activeTaskOne && (
          <div className={`d-flex justify-content-between i-task p-3`}>
        <div>
        <p className='text-theme bold'><span>
              <span>
              <button
              type="button" className="btn custom-tooltip" onClick={handleShow}>
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
              </span>
              <span>Task Description:</span>
              </span></p>
          <p>Description: {activeTaskOne.description}</p>
          <p>Reward: <span className='text-theme bold'>+{activeTaskOne.reward}</span></p>
        </div>
        <div>
           <>
            {isTaskConfirmed !== null && isTaskPending !== null && (
              <>
                {isTaskOneLoading ? (<><img src={myRedImage} alt="Loading" width="20" height="20" style={{
                borderRadius : '50%',
              }}/></>
                ): isTaskPending ? (
           <>
            <p>Pending Confirmation</p>
           </>):
           isTaskConfirmed ? (
           <>
            <p>Task Confirmed</p>
            </>):
           (<>
            <label
                  htmlFor="imageInput"
                  className='text-center'
                  style={{
                    display: 'block',
                    width: '150px', // Set your preferred width
                    height: '40px', // Set your preferred height
                    border: '2px solid #ddd',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >Upload File</label>
                <input
                  type="file"
                  accept="image/*"
                  id="imageInput"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
           </>)}
                 
              </>
            )}
           </>
        </div>
        </div>
      )}
       {/* second active tasks position */}
       {activeTaskTwo && (
          <div className={`d-flex justify-content-between i-task p-3`}>
        <div>
        <p className='text-theme bold'><span>
              <span>
              <button
              type="button" className="btn custom-tooltip" onClick={handleShow}>
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
              </span>
              <span>Task Description:</span>
              </span></p>
          <p>Description: {activeTaskTwo.description}</p>
          <p>Reward: <span className='text-theme bold'>+{activeTaskTwo.reward}</span></p>
        </div>
        <div>
           <>
            {isTaskConfirmedTwo !== null && isTaskPendingTwo !== null && (
              <>
                {isTaskOneLoadingTwo ? (<><img src={myRedImage} alt="Loading" width="20" height="20" style={{
                borderRadius : '50%',
              }}/></>
                ):
                isTaskPendingTwo ? (
           <>
            <p>Pending Confirmation</p>
           </>):
           isTaskConfirmedTwo ? (
           <>
            <p>Task Confirmed</p>
            </>):
           (<>
            <label
                  htmlFor="imageInput2"
                  className='text-center'
                  style={{
                    display: 'block',
                    width: '150px', // Set your preferred width
                    height: '40px', // Set your preferred height
                    border: '2px solid #ddd',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >Upload File</label>
                <input
                  type="file"
                  accept="image/*"
                  id="imageInput2"
                  style={{ display: 'none' }}
                  onChange={handleFileChangeTwo}
                />
           </>)}
                 
              </>
            )}
           </>
        </div>
        </div>
      )}
      {/* active task three */}
      {activeTaskThree && (
          <div className={`d-flex justify-content-between i-task p-3`}>
        <div>
        <p className='text-theme bold'><span>
              <span>
              <button
              type="button" className="btn custom-tooltip" onClick={handleShow}>
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
              </span>
              <span>Task Description:</span>
              </span></p>
          <p>Description: {activeTaskThree.description}</p>
          <p>Reward: <span className='text-theme bold'>+{activeTaskThree.reward}</span></p>
        </div>
        <div>
           <>
           {isTaskOneLoadingThree ? (<><img src={myRedImage} alt="Loading" width="20" height="20" style={{
                borderRadius : '50%',
              }}/></>
                ):
            isTaskConfirmedThree !== null && isTaskPendingThree !== null && (
              <>
                {isTaskPendingThree ? (
           <>
            <p>Pending Confirmation</p>
           </>):
           isTaskConfirmedThree ? (
           <>
            <p>Task Confirmed</p>
            </>):
           (<>
            <label
                  htmlFor="imageInput3"
                  className='text-center'
                  style={{
                    display: 'block',
                    width: '150px', // Set your preferred width
                    height: '40px', // Set your preferred height
                    border: '2px solid #ddd',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >Upload File</label>
                <input
                  type="file"
                  accept="image/*"
                  id="imageInput3"
                  style={{ display: 'none' }}
                  onChange={handleFileChangeThree}
                />
           </>)}
                 
              </>
            )}
           </>
        </div>
        </div>
      )}

      {/* active task four */}
      {activeTaskFour && (
          <div className={`d-flex justify-content-between i-task p-3`}>
        <div>
        <p className='text-theme bold'><span>
              <span>
              <button
              type="button" className="btn custom-tooltip" onClick={handleShow}>
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
              </span>
              <span>Task Description:</span>
              </span></p>
          <p>Description: {activeTaskFour.description}</p>
          <p>Reward: <span className='text-theme bold'>+{activeTaskFour.reward}</span></p>
        </div>
        <div>
           <>
           {isTaskOneLoadingFour ? (<><img src={myRedImage} alt="Loading" width="20" height="20" style={{
                borderRadius : '50%',
              }}/></>
                ):
            isTaskConfirmedFour !== null && isTaskPendingFour !== null && (
              <>
                {isTaskPendingFour ? (
           <>
            <p>Pending Confirmation</p>
           </>):
           isTaskConfirmedFour ? (
           <>
            <p>Task Confirmed</p>
            </>):
           (<>
            <label
                  htmlFor="imageInput4"
                  className='text-center'
                  style={{
                    display: 'block',
                    width: '150px', // Set your preferred width
                    height: '40px', // Set your preferred height
                    border: '2px solid #ddd',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >Upload File</label>
                <input
                  type="file"
                  accept="image/*"
                  id="imageInput4"
                  style={{ display: 'none' }}
                  onChange={handleFileChangeFour}
                />
           </>)}
                 
              </>
            )}
           </>
        </div>
        </div>
      )}

      {/* active task five */}

      {activeTaskFive && (
          <div className={`d-flex justify-content-between i-task p-3`}>
        <div>
        <p className='text-theme bold'><span>
              <span>
              <button
              type="button" className="btn custom-tooltip" onClick={handleShow}>
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
              </span>
              <span>Task Description:</span>
              </span></p>
          <p>Description: {activeTaskFive.description}</p>
          <p>Reward: <span className='text-theme bold'>+{activeTaskFive.reward}</span></p>
        </div>
        <div>
           <>
           {isTaskOneLoadingFive ? (<><img src={myRedImage} alt="Loading" width="20" height="20" style={{
                borderRadius : '50%',
              }}/></>
                ):
            isTaskConfirmedFive !== null && isTaskPendingFive !== null && (
              <>
                {isTaskPendingFive ? (
           <>
            <p>Pending Confirmation</p>
           </>):
           isTaskConfirmedFive ? (
           <>
            <p>Task Confirmed</p>
            </>):
           (<>
            <label
                  htmlFor="imageInput5"
                  className='text-center'
                  style={{
                    display: 'block',
                    width: '150px', // Set your preferred width
                    height: '40px', // Set your preferred height
                    border: '2px solid #ddd',
                    borderRadius: '5px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >Upload File</label>
                <input
                  type="file"
                  accept="image/*"
                  id="imageInput5"
                  style={{ display: 'none' }}
                  onChange={handleFileChangeFive}
                />
           </>)}
                 
              </>
            )}
           </>
        </div>
        </div>
      )}
      </div>
      {/* end of tasks display */}
        {!task && !bonusTask && (
          <>
            <div className={`unavailable increase_size`}>
            <p className='sm-col text-secondary d-flex text-center'>
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
                {isUserActive
                  ? 'No Drops Available' 
                  : `Activate your account to see available drops`}
              </span>

              </p>
          </div>
          </>
        )}
        </>
      ):
      <>
      <div className={`unavailable increase_size`}>
            <p className='sm-col text-secondary d-flex text-center'>
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
                {isUserActive
                  ? 'No Drops Available' 
                  : `Activate your account to see available drops`}
              </span>

              </p>
          </div>
      </>
      }
        
    </div>
  );
};

export default TaskManager;
