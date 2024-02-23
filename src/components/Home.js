// import useContext, useRef, useEffect, useCallback
import { useContext, useRef, useEffect, useState, useCallback, Component } from 'react';
// import custom components.
import Loading from './Loading';
import TaskManager from './TaskManager';
// import Context
import Context from '../Context';
// firebase auth
import { auth, realTimeDb } from '../firebase';
import { ref, onValue} from 'firebase/database'
import { useFirebase } from './UserRoleContext';

function Home() {
  const { userImg, userEmail, userFullName, userID, userPhoneNo, userRole, userBalance, setUserBalance, isUserActive } = useFirebase();

  
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
    <div className=' home-container'>
      <div className='container'>
      <div style={boxStyle} className='border-top-theme'>
        <div className="my-auto ride-detail__user-avatar  d-flex justify-content-start align-items-start">
          <img src={userImg} />
          <div className='second_welcome_elements display-block'><h3 className='text-start bold'>Welcome, <span className='bold'>{userFullName}</span></h3>
          <p className={isUserActive ? 'alert alert-success' : 'alert alert-danger'}>{isUserActive ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      
    </div>
    <h2 className='text-center mt-2 bolder'>Recent Drops</h2>
      <div className='taskBox border-top-theme' style={taskBoxStyle}>
      <TaskManager />
      </div>
      </div>
      </div>
    </>
      
  );
}

export default Home;