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
import MyModal from './MyModal'; // Replace with the correct path

const TaskManager = () => {
  const [task, setTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pendingTaskCheck, setPendingTaskCheck] = useState(null);
  const [bonusTask, setBonusTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([null]); // Add completedTasks state
  const { userImg, userEmail, userFullName, userID, userPhoneNo, userRole, userBalance, setUserBalance, dailyDropLimit, isUserActive } = useFirebase();
  const user = auth.currentUser;
  const [notification, setNotification] = useState(null);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [isBonusBtnLoading, setIsBonusBtnLoading] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [isTaskLoading, setIsTaskLoading] = useState(false);
  const [taskNumber, setTaskNumber] = useState(null);

  const isTaskCompleted = completedTasks.includes(task?.taskID);
  const isBonusTaskCompleted = completedTasks.includes(bonusTask?.taskID);


  const [pendingTasks, setPendingTasks] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);




  const handleShow = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  useEffect(() => {
    const fetchPendingTasks = async () => {
      try {
        const firestore = getFirestore();

        // Create a query to get tasks from 'pendingTasks' collection
        const q = query(collection(firestore, 'pendingTasks'), where('userId', '==', userID), where('pending', '==', true));

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Extract task IDs from the query result
        const filteredTasks = querySnapshot.docs.map(taskDoc => taskDoc.data().taskId);

        setPendingTasks(filteredTasks);
      } catch (error) {
        console.error('Error fetching pending tasks:', error);
      }
    };

    // Call the function to fetch pending tasks
    fetchPendingTasks();
  }, [userID]);
  



  const handleFileChange = (event) => {
    setIsTaskLoading(true);
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
          }, 
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              const imageSrc = downloadURL;
              const writeImageData = async() =>{
                // Create a document in 'pendingTasks'
                try {
                  const userDocRef = doc(db, 'users', userID);
              
                  // Get the current value of taskCounter or default to 0 if the field does not exist
                  const userDoc = await getDoc(userDocRef);
              
                  if (userDoc.exists()) {
                      if(userDoc.data().taskCounter){
                        
                        const currentTaskCounter = userDoc.data().taskCounter;
                        const taskCounter = currentTaskCounter + 1;
              
                        // Update the value of taskCounter by adding 1
                        await updateDoc(userDocRef, {
                          taskCounter,
                        });
  
                        await addDoc(collection(getFirestore(), 'pendingTasks'), {
                          userId: userID,
                          taskId: `soc-Task${taskCounter}`,
                          confirmed: false,
                          declined: false,
                          pending: true,
                          imageSrc,
                          // Other task data as needed
                        });

                         /* eslint-disable no-restricted-globals */
                          setTimeout(() => {
                            location.reload(true);
                          }, 5000);
                          /* eslint-enable no-restricted-globals */
              
                    }
                    else{
                      const currentTaskCounter = 0;
                      const taskCounter = currentTaskCounter + 1;
                      await updateDoc(userDocRef, {
                        taskCounter : 1,
                      });
  
                      await addDoc(collection(getFirestore(), 'pendingTasks'), {
                        userId: userID,
                        taskId: `soc-Task${taskCounter}`,
                        confirmed: false,
                        declined: false,
                        pending: true,
                        imageSrc,
                        // Other task data as needed
                      });

                       /* eslint-disable no-restricted-globals */
                      setTimeout(() => {
                        location.reload(true);
                      }, 5000);
                      /* eslint-enable no-restricted-globals */
                    }
                    
              
                  
                  } else {
                    // If the document does not exist, you may want to create it with taskCounter initialized to 1
                    // or handle it according to your use case
                    console.log('User document not found. Handle this case as needed.');
                  }
                } catch (error) {
                  console.error('Error incrementing task counter:', error);
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
      }
    }, 3000);
  };

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
    const userBalanceRef = doc(db, 'users', user.uid); // Assuming 'users' is your collection name
    const userBalanceSnapshot = await getDoc(userBalanceRef);

    const adRevenue = userBalanceSnapshot.data().adRevenue;
    await updateDoc(userBalanceRef, {
      adRevenue: parseFloat(adRevenue) + 25,
    });
    // Redirect the user
    window.location.href = randomLink;
   }
  catch(error){
    console.log(`error: ${error}`);
  }
  
};


  useEffect(() => {
    const fetchTasks = async () => {
      const activeTasksQuery = query(
        collection(getFirestore(), 'activeTasks')
      );
      const activeTasksSnapshot = await getDocs(activeTasksQuery);

      const completedTasksQuery = query(
        collection(getFirestore(), `users/${userID}/completedTasks`)
      );
      const completedTasksSnapshot = await getDocs(completedTasksQuery);

      const completedTaskIds = completedTasksSnapshot.docs.map((doc) => doc.id);

      const availableTasks = activeTasksSnapshot.docs.map((doc) => {
        const task = { id: doc.id, ...doc.data() };
        task.status = completedTaskIds.includes(doc.id) ? 'Confirmed' : 'Pending';
        return task;
      });

      setTasks(availableTasks);
    };

    fetchTasks();
  }, [userID]);

  useEffect(() => {
    const pendingTasksQuery = query(
      collection(getFirestore(), 'pendingTasks'),
      where('userId', '==', userID)
    );

    const unsubscribe = onSnapshot(pendingTasksQuery, (snapshot) => {
      // Check if the query exists
      if (snapshot) {
        snapshot.docChanges().forEach(async (change) => {
          const task = change.doc.data();
          
          // Ensure that the 'confirmed' field is initially set to false
          if (task.confirmed) {
            // Move task to 'completedTasks'
            const taskId = task.taskId
            await addDoc(collection(getFirestore(), `users/${userID}/completedTasks`), {
              taskId,
              // Copy other task data as needed
            });

            try {
              const userBalanceRef = doc(db, 'users', user.uid); // Assuming 'users' is your collection name
              const userBalanceSnapshot = await getDoc(userBalanceRef);
              if (userBalanceSnapshot.exists()) {
                const userBalanceData = userBalanceSnapshot.data();
      
                const ReferralsBalance = userBalanceSnapshot.data().referralsBalance;
      
                await updateDoc(userBalanceRef, {
                  referralsBalance: parseFloat(ReferralsBalance) + 100,
                });

                toast.success('Bonus Received.', {
                  position: toast.POSITION.TOP_CENTER,
                });
              }
            } catch (error) {
              console.error('Error fetching user balance:', error);
            }

            // Remove task from 'pendingTasks'
            await deleteDoc(doc(getFirestore(), 'pendingTasks', change.doc.id));
          }
          if(task.pending){
            setPendingTaskCheck(true);
          }
          if(task.declined){
            toast.error('Task Failed!', {
              position: toast.POSITION.TOP_CENTER,
            });
            // adjust taskCounter
            const userDocRef = doc(db, 'users', userID);
              
            // Get the current value of taskCounter or default to 0 if the field does not exist
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              if(userDoc.data().taskCounter){
                
                const currentTaskCounter = userDoc.data().taskCounter;
                if(currentTaskCounter > 0){
                  const taskCounter = currentTaskCounter - 1;
                   // Update the value of taskCounter by adding 1
                  await updateDoc(userDocRef, {
                  taskCounter,
                  });
                }
                else{
                  const taskCounter = 0;
                   // Update the value of taskCounter by adding 1
                  await updateDoc(userDocRef, {
                  taskCounter,
                  });
                }
      
               
      
            }
            
      
          
          } else {
            // If the document does not exist, you may want to create it with taskCounter initialized to 1
            // or handle it according to your use case
            console.log('User document not found. Handle this case as needed.');
          }
            // Remove task from 'pendingTasks'
            await deleteDoc(doc(getFirestore(), 'pendingTasks', change.doc.id));

            
          }
        });
      }
    });

    return () => unsubscribe();
  }, [userID]);
  


  useEffect(() => {
    const firestore = getFirestore();
  
    // Generate the task ID for the current date in the format 'task-YYYYMMDD'
    const currentDate = new Date();
    const taskID = `task-${currentDate.getFullYear()}${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
  
    // Generate the bonus task ID using the same currentDate
    const bonusTaskID = `bonusTask-${currentDate.getFullYear()}${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${currentDate.getDate().toString().padStart(2, '0')}`;
  
    const fetchDailyTask = async () => {
      try{
        const taskRef = doc(firestore, 'dailyTasks', taskID);
      const taskSnapshot = await getDoc(taskRef);
      
      if (taskSnapshot.exists()) {
        setTask(taskSnapshot.data());
      }
      }
      catch(error){
        console.log('Error fetching daily task:', error.message);
      }
    };
  
    const fetchBonusTask = async () => {
      try{
        const taskRef = doc(db, 'dailyTasks', bonusTaskID);
      const taskSnapshot = await getDoc(taskRef);
      
      if (taskSnapshot.exists()) {
        setBonusTask(taskSnapshot.data());
      }
      }
      catch(error){
        console.log('Error fetching daily task:', error.message);
      }
    };
  
    onAuthStateChanged(auth, (user) => {
      // fetching completed user tasks
      const fetchCompletedTasks = async () => {
        if (user) {
          try{
            const completedTasksCollection = collection(db, 'users', user.uid, 'completedTasks');
          const querySnapshot = await getDocs(completedTasksCollection);
          const completedTaskIds = querySnapshot.docs.map((doc) => doc.data().taskId);
          setCompletedTasks(completedTaskIds);
          }
          catch(error){
            console.log('Error fetching completed tasks:', error.message);
          }
        }
      };
  
      fetchCompletedTasks();
    });
  
    // Call both fetch functions
    fetchDailyTask();
    fetchBonusTask();
  }, []);
  

   // Function to refresh completed tasks
   const refreshCompletedTasks = async () => {
     if (user) {
       const completedTasksCollection = collection(db, 'users', user.uid, 'completedTasks');
       const querySnapshot = await getDocs(completedTasksCollection);
       const completedTaskIds = querySnapshot.docs.map((doc) => doc.data().taskId);
       setCompletedTasks(completedTaskIds);
     }
     else{
      console('refresh drop not confirmed!');
     }
   };

  const completeTask = async () => {
    setIsBtnLoading(true);
    if (isTaskCompleted) {
      setIsBtnLoading(false);
      toast.warning('You have already completed this task.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  else if (user && task && userBalance !== null && completedTasks !== null) {
      // Fetch the reward amount from the task or any other location in your database
      const currentUserID = user.uid; // Replace with the actual user ID

      // Get the current user's document
      const currentUserDocRef = doc(db, 'users', currentUserID);
      const currentUserSnapshot = await getDoc(currentUserDocRef);

    if(currentUserSnapshot.exists()){
      const rewardAmount = task.reward;
      const dailyDropBalance = currentUserSnapshot.data().dailyDropBalance + rewardAmount;
      const referralsBalance = currentUserSnapshot.data().referralsBalance;
      const newBalance = dailyDropBalance + referralsBalance;

      // other code
      await updateDoc(currentUserDocRef, {
        dailyDropBalance: dailyDropBalance,
        balance: newBalance,
      });
      
  
      // Update the user's balance in Firebase
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { balance: newBalance });
  
      // Fetch the updated user balance from the server
      const userBalanceRef = doc(db, 'users', user.uid);
      const userBalanceSnapshot = await getDoc(userBalanceRef);
      
      if (userBalanceSnapshot.exists()) {
        const updatedBalance = userBalanceSnapshot.data().balance;
        
        // Update userBalance in the context
        setUserBalance(updatedBalance);
      }
        // Mark the task as completed for the user
      const userTaskRef = collection(db, 'users', user.uid, 'completedTasks');
      await addDoc(userTaskRef, { taskId: task.taskID });
    }

  
    
      // Refresh the completed tasks
      await refreshCompletedTasks();
      setIsBtnLoading(false);
      toast.success('Drop Collected!', {
        position: toast.POSITION.TOP_CENTER,
      });
    } 
  };

  const completeBonusTask = async () => {
    setIsBonusBtnLoading(true);
    if (isBonusTaskCompleted) {
      setIsBonusBtnLoading(false);
      toast.warning('You have already completed this task.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  else if (user && bonusTask && userBalance !== null && completedTasks !== null) {
        // Fetch the reward amount from the task or any other location in your database
        const currentUserID = user.uid; // Replace with the actual user ID

        // Get the current user's document
        const currentUserDocRef = doc(db, 'users', currentUserID);
        const currentUserSnapshot = await getDoc(currentUserDocRef);
  
      if(currentUserSnapshot.exists()){
        const rewardAmount = bonusTask.reward;
        const dailyDropBalance = currentUserSnapshot.data().dailyDropBalance + rewardAmount;
        const referralsBalance = currentUserSnapshot.data().referralsBalance;
        const newBalance = dailyDropBalance + referralsBalance;
  
        // other code
        await updateDoc(currentUserDocRef, {
          dailyDropBalance: dailyDropBalance,
          balance: newBalance,
        });
        
    
        // Update the user's balance in Firebase
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { balance: newBalance });
    
        // Fetch the updated user balance from the server
        const userBalanceRef = doc(db, 'users', user.uid);
        const userBalanceSnapshot = await getDoc(userBalanceRef);
        
        if (userBalanceSnapshot.exists()) {
          const updatedBalance = userBalanceSnapshot.data().balance;
          
          // Update userBalance in the context
          setUserBalance(updatedBalance);
        }
          // Mark the task as completed for the user
        const userTaskRef = collection(db, 'users', user.uid, 'completedTasks');
        await addDoc(userTaskRef, { taskId: bonusTask.taskID });
      }
  
    
      // Refresh the completed tasks
      await refreshCompletedTasks();
      setIsBonusBtnLoading(false);
      toast.success('Drop Collected!', {
        position: toast.POSITION.TOP_CENTER,
      });
    } 

  };
  
  return (
    <div className='drop-list'>
       <ToastContainer />
       <MyModal showModal={showModal} handleClose={handleClose} />
      {user && isUserActive ? (
        <>
        <div>
        {tasks.map((task) => (
          <div className='d-flex justify-content-between i-task p-3' key={task.id}>
            <div className='f-task'>
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
            <p>{task.description} <button style={{
              color: '#0000FF',
              border: 'none',
              backgroundColor: '#fff',
            }} onClick={handleShow}>(Read Instructions)</button></p>
            <p>Reward: <span className='text-theme bold'>+{task.reward}</span></p>
            </div>
            <div className='sec-task'>
            {task.status === 'Pending' && (
              <>
          
            {isTaskLoading ? (
              <>
              <img src={myRedImage} alt="Loading" width="20" height="20" style={{
                borderRadius : '50%',
              }}/>
              </>
            ):task.status === 'Pending' && pendingTasks.includes(task.id) ?(
                  <><p className='p-border-theme'>Pending Confirmation</p></>
            ): completedTasks.includes(task.id) ? (
                  <>
                  <p>Task Completed</p>
                  </>
            ):  (
                  <>
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
                  </>
                )}
              </>
            )}
            {task.status === 'Confirmed' && <p>Confirmed</p>}
            </div>
          </div>
        ))}
      </div>
        {task && (
          <div className='d-flex justify-content-between i-task p-3'>
          <div className='first-part'>
          <p className='text-theme bold'>Claim your daily drop:</p>
          <p className=''>{task.description}</p>
          </div>
          <button id='myButton' className={`${task.description === 'bonus task' ? 'bonus-btn' : 'task-btn'}`} onClick={completeTask}>
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
        {bonusTask && (
          <div className='d-flex justify-content-between i-task p-3'>
            <div className='first-part'>
             <p className='text-theme bold'>Bonus Drop Available:</p>
             <p className=''>{bonusTask.description}</p>
            </div>
            <button
              id='myButton'
              className={`task-btn`}
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
        {/* {display ads} */}
        <div className='d-flex justify-content-between i-task p-3'>
            <div className='first-part'>
             <p className='text-theme bold'>Check out ads:</p>
             <p className=''>Stay for at least five seconds after clicking to verify completion.</p>
             <p>Reward per ad view: <span className='text-theme bold'>+25</span></p>
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
