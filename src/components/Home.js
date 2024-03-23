// import useContext, useRef, useEffect, useCallback
import { useContext, useRef, useEffect, useState, useCallback, Component } from 'react';
// import custom components.
import Loading from './Loading';
import TaskManager from './TaskManager';
import TaskList from './TaskList';
// import Context
import Context from '../Context';
// firebase auth
import { auth, realTimeDb } from '../firebase';
import { ref, onValue} from 'firebase/database'
import { useFirebase } from './UserRoleContext';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";

function Home() {
  const user = auth.currentUser;
  const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, isTaskConfirmed, setIsTaskConfirmed, isTaskPending, setIsTaskPending, completedTasks, setCompletedTasks, isTaskPendingTwo, setIsTaskPendingTwo, isTaskConfirmedTwo, setIsTaskConfirmedTwo,  isTaskPendingThree, setIsTaskPendingThree, isTaskConfirmedThree, setIsTaskConfirmedThree, isTaskPendingFour, setIsTaskPendingFour, isTaskConfirmedFour, setIsTaskConfirmedFour, isTaskPendingFive, setIsTaskPendingFive, isTaskConfirmedFive, setIsTaskConfirmedFive,  isTaskDeclined, setIsTaskDeclined, isTaskDeclinedTwo, setIsTaskDeclinedTwo, isTaskDeclinedThree, setIsTaskDeclinedThree, isTaskDeclinedFour, setIsTaskDeclinedFour, isTaskDeclinedFive, setIsTaskDeclinedFive, isTaskActuallyConfirmed, setIsTaskActuallyConfirmed, isTaskActuallyConfirmedTwo, setIsTaskActuallyConfirmedTwo, isTaskActuallyConfirmedThree, setIsTaskActuallyConfirmedThree, isTaskActuallyConfirmedFour, setIsTaskActuallyConfirmedFour, isTaskActuallyConfirmedFive, setIsTaskActuallyConfirmedFive,  activeTaskOne, setActiveTaskOne, activeTaskTwo, setActiveTaskTwo, activeTaskThree, setActiveTaskThree, activeTaskFour, setActiveTaskFour, activeTaskFive, setActiveTaskFive } = useFirebase();
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  
const handleTriggerNotification = async () => {
  setIsCheckLoading(true);
  if(user){
    const userDetails = {
      userID,
      activeTaskOne,
      activeTaskTwo,
      activeTaskThree,
      activeTaskFour,
      activeTaskFive,
      isTaskActuallyConfirmed,
      isTaskActuallyConfirmedTwo,
      isTaskActuallyConfirmedThree,
      isTaskActuallyConfirmedFour,
      isTaskActuallyConfirmedFive,
      isTaskDeclined,
      isTaskDeclinedTwo,
      isTaskDeclinedThree,
      isTaskDeclinedFour,
      isTaskDeclinedFive, // Add a flag to track bonus addition
    };
    try {
      const response = await fetch('https://dripdash.onrender.com/api/updateBonusAfterTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.success) {
        toast.success(`Task Reward Claimed`, {
          toastId: 'toast-task-success',
        });
        setIsCheckLoading(false);
      } else if(data.message !== 'No matching conditions'){
        toast.error(`No Completed Tasks To Claim`, {
          toastId: 'toast-task-failed',
        });
        setIsCheckLoading(false);
      }
      else{
        toast.error(`No Completed Tasks To Claim`, {
          toastId: 'toast-task-failed2',
        });
        setIsCheckLoading(false);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setIsCheckLoading(false);
    }
  }
};

  const initializeTooltip = (element) => {
    if (element) {
      const tooltip = new window.bootstrap.Tooltip(element, {
        placement: 'top', // Adjust placement as needed
        title: element.title,
      });
    }
  };
  const tooltipRef = useRef();
  const tooltipTitle = `Join a Whatsapp group near you to stay up to date`;

  const tooltipRef2 = useRef();
  const tooltipTitle2 = `Get Reward From Pending Tasks`;

  useEffect(() => {
    initializeTooltip(tooltipRef.current);
  }, []);

  useEffect(() => {
    initializeTooltip(tooltipRef2.current);
  }, []);
  
  useEffect(() => {
    // Remove the 'new' key from localStorage
    localStorage.removeItem('new');
  }, []);

  const boxStyle = {
    width: '100%',
    backgroundColor: '#FFF', // White background color
    color: '#000', // Text color
    textAlign: 'center',
    padding: '5px',
  };
  const taskBoxStyle = {
    width: '100%',
    height: '330px',
    backgroundColor: '#FFF', // White background color
    color: '#000', // Text color
    padding: '20px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', // Box shadow
  };

  return (
   <>
   <ToastContainer />
    <div className=' home-container'>
      <div className='container'>
      <div style={boxStyle} className='border-top-theme'>
        <div className="my-auto ride-detail__user-avatar  d-flex justify-content-start align-items-start">
          <img src={userImg} />
          <div className='second_welcome_elements display-block'><h3 className='text-start bold'>Welcome, <span className='bold'>{userFullName}</span></h3>
          <p className={isUserActive ? 'alert alert-success' : 'alert alert-danger'}>{isUserActive ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      {/* svg */}
        <Button className='position-fixed bottom-0 end-0 mb-5 remove-default-btn' type="button" ref={tooltipRef} data-bs-toggle="tooltip" data-placement="top" title={tooltipTitle}  data-html="true" href='https://chat.whatsapp.com/Bx4lIRm15GF4xxRTNgg7vv' target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-whatsapp text-success" viewBox="0 0 16 16" >
            <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
          </svg>
        </Button>

        <button className={`d-flex position-fixed justify-content-between ${!isUserActive ? 'd-none': ''} cl-btn ${userRole === 'checker' && userRole !== null ? 'd-none' : ''}`} type="button" ref={tooltipRef2} data-bs-toggle="tooltip" data-placement="top" title={tooltipTitle2}  data-html="true" target="_blank" onClick={handleTriggerNotification}>
          <span>Claim Bonus From Task</span>
          <span className={`mx-2`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className={`bi bi-arrow-clockwise ${isCheckLoading ? 'rotating-element' : ''} `} viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
        </svg></span>
        </button>
      {/*  */}
    </div>
    {userRole === 'checker' && userRole !== null ? (
    <>
    <TaskList />
    </>):
    (<>
    <h2 className='text-center mt-5 bolder'>Recent Drops</h2>
      <div className='taskBox border-top-theme' style={taskBoxStyle}>
      <TaskManager />
      </div>
    </>)}
      </div>
      </div>
    </>
      
  );
}

export default Home;