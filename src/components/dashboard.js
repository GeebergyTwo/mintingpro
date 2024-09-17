import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useUser } from '../functionalComponents/UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCopy } from '@fortawesome/free-solid-svg-icons';
import Loading from '../functionalComponents/Loading';

const Dashboard = () => {
  const { userData, handleGetUser } = useUser();
  const [loading, setLoading] = useState(true);
  const storedUserId = localStorage.getItem('auth');

  // Fetch user data on component mount
  useEffect(() => {
    if (!userData) {
      handleGetUser(storedUserId).then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [userData, handleGetUser]);

  const handleCopy = () => {
    const tempInput = document.createElement('input');
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const referralLink = `${baseUrl}/signup?ref=${userData?.userReferralCode || ''}`;
    
    tempInput.value = referralLink;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    toast.info('Referral link copied to clipboard!', {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const baseMintRate = 0.05; // Mint rate at level 1
  const levelIncrement = 0.01; // Increment per level
  const maxLevel = 15;
  const maxMintRate = 0.19; // Mint rate at level 15
  
  const getUserLevel = (mintRate, isUserActive) => {
    if (!isUserActive || mintRate === 0) {
      return 'Inactive';
    }
  
    if (mintRate >= maxMintRate) {
      return maxLevel;
    }
  
    const level = Math.floor((mintRate - baseMintRate) / levelIncrement) + 1;
  
    return level < 1 ? 1 : level;
  };
  
  // Ensure mint_rate and isUserActive exist before calculating the user level
  const userLevel = userData && userData.mint_rate !== undefined && userData.isUserActive !== undefined 
    ? getUserLevel(userData.mint_rate, userData.isUserActive)
    : 'Unknown';
  
  console.log('User level:', userLevel);
  

  const scrollContainer = {
    paddingBottom: '80px',
    paddingTop: '20px',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #3c3f4c, #262A36)',
  };

  const spaceBetween = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #fff',
    padding: '8px',
  };

  const profilePicContainer = {
    height: '70px',
    width: '70px',
    padding: '10px',
    border: '2px solid #fff',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const profilePic = {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
  };

  const big = {
    fontSize: '20px',
  };

  const bigBold = {
    fontSize: '34px',
    fontWeight: 'bold',
  };

  const levelContainerStyle = {
    backgroundColor: '#A366FF',
    color: '#6D00FF',
    padding: '10px 20px',
    borderRadius: '8px',
    display: 'inline-block',
    fontWeight: 'bold',
  };
      
  return (
    <div style={scrollContainer} className='pTop-80'>
      <ToastContainer />
      <div className='main-content'>
      <Container>
        <h1>Profile Page</h1>
        <div style={profilePicContainer} className='mt-4'>
          <FontAwesomeIcon icon={faUser} size="2x" style={profilePic}/>
        </div>
        {loading || !userData ? (
              <span>Loading...</span>
            ):
            (
              <div className="fw-bold mt-2" style={levelContainerStyle}>
                {userLevel === 'Inactive' ? 'Inactive' : `Level ${userLevel}`}
              </div>
         )}

        <div style={spaceBetween} className='mt-3'>
          <p className='fw-bold' style={big}>Referral Link:</p>
          <FontAwesomeIcon onClick={handleCopy} icon={faCopy} size="2x" />
        </div>

        <div style={spaceBetween} className='mt-3'>
          <p className='fw-bold' style={big}>Username:</p>
          <p>{userData?.username || ''}</p>
        </div>

        <div style={spaceBetween} className='mt-3'>
          <p className='fw-bold' style={big}>Email:</p>
          <p>{userData?.email || ''}</p>
        </div>

        <div style={spaceBetween} className='mt-3'>
          <p className='fw-bold' style={big}>Country Of Origin:</p>
          <p>{userData?.country || ''}</p>
        </div>

        <div style={spaceBetween} className='mt-3'>
          <p className='fw-bold' style={big}>Phone No:</p>
          <p>{userData?.phone_no || ''}</p>
        </div>

        <div style={spaceBetween} className='mt-3'>
          <p className='fw-bold' style={big}>Inactive Referrals:</p>
          <p>{userData?.inactiveReferrals || 0}</p>
        </div>

        <div style={spaceBetween} className='mt-3'>
          <p className='fw-bold' style={big}>Active Referrals:</p>
          <p>{userData?.activeReferrals || 0}</p>
        </div>
      </Container>
      </div>
    </div>
  );
};

export default Dashboard;
