// TaskList.js
import React, { useState, useEffect } from 'react';
import { useFirebase } from './UserRoleContext';
import { ToastContainer, toast } from "react-toastify";


const TaskList = () => {
  const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, isTaskConfirmed, setIsTaskConfirmed, isTaskPending, setIsTaskPending, completedTasks, setCompletedTasks, isTaskPendingTwo, setIsTaskPendingTwo, isTaskConfirmedTwo, setIsTaskConfirmedTwo,  isTaskPendingThree, setIsTaskPendingThree, isTaskConfirmedThree, setIsTaskConfirmedThree, isTaskPendingFour, setIsTaskPendingFour, isTaskConfirmedFour, setIsTaskConfirmedFour, isTaskPendingFive, setIsTaskPendingFive, isTaskConfirmedFive, setIsTaskConfirmedFive,  isTaskDeclined, setIsTaskDeclined, isTaskDeclinedTwo, setIsTaskDeclinedTwo, isTaskDeclinedThree, setIsTaskDeclinedThree, isTaskDeclinedFour, setIsTaskDeclinedFour, isTaskDeclinedFive, setIsTaskDeclinedFive, isTaskActuallyConfirmed, setIsTaskActuallyConfirmed, isTaskActuallyConfirmedTwo, setIsTaskActuallyConfirmedTwo, isTaskActuallyConfirmedThree, setIsTaskActuallyConfirmedThree, isTaskActuallyConfirmedFour, setIsTaskActuallyConfirmedFour, isTaskActuallyConfirmedFive, setIsTaskActuallyConfirmedFive,  activeTaskOne, setActiveTaskOne, activeTaskTwo, setActiveTaskTwo, activeTaskThree, setActiveTaskThree, activeTaskFour, setActiveTaskFour, activeTaskFive, setActiveTaskFive } = useFirebase();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://dripdash.onrender.com/api/getTasks');
      const tasks = await response.json();
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

  const acceptTask = async (taskId, description, userId) => {
    try {
      const response = await fetch(`https://dripdash.onrender.com/api/acceptTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, description, userId }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast.success('Task accepted successfully!', {
            position: toast.POSITION.TOP_CENTER,
        });
        fetchTasks(); // Refresh the task list
      } else {
        console.error('Error accepting task:', result.message);
      }
    } catch (error) {
      console.error('Error accepting task:', error.message);
    }
  };

  const declineTask = async (taskId, description, userId) => {
    try {
      const response = await fetch(`https://dripdash.onrender.com/api/declineTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId, description, userId }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        toast.success('Task declined successfully!', {
            position: toast.POSITION.TOP_CENTER,
        });
        fetchTasks(); // Refresh the task list
      } else {
        console.error('Error declining task:', result.message);
      }
    } catch (error) {
      console.error('Error declining task:', error.message);
    }
  };

  return (
    <div>
    <ToastContainer />
    <h1>Task Manager</h1>
    <div className="custom-task-list d-block">
      {tasks.map((task) => (
        <div key={task.id} className="custom-task-card">
          <p className={`${task.confirmed ? 'text-success' : task.declined ? 'text-danger' : ''}`}>{task.confirmed ? (<>Marked as Accepted</>) : task.declined ?(<>Marked as Declined</>) : (<>Not Marked</>)}</p>
          <img src={task.imageSrc} alt={`Task ${task.id}`} className="custom-task-image" />
          <p className="custom-task-description">{task.description}</p>
          <div className="custom-button-container">
            <button className='btn btn-success' onClick={() => acceptTask(task.taskId, task.description, task.userId)}>Accept</button>
            <button className='btn btn-danger' onClick={() => declineTask(task.taskId, task.description, task.userId)}>Decline</button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default TaskList;
