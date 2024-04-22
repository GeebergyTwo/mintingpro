// import useContext, useRef, useEffect, useCallback
import { useContext, useRef, useEffect, useState, useCallback, Component } from 'react';
import {Link, useMatch, useResolvedPath, useNavigate} from 'react-router-dom';
// import custom components.
import Loading from './Loading';
import TradingViewWidget from './TradingViewWidget';

// import Context
import Context from '../Context';
// firebase auth
import { auth, realTimeDb } from '../firebase';
import { ref, onValue} from 'firebase/database'
import { useFirebase } from './UserRoleContext';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";
import FeeItem from './FeeItem';

function Home() {
  const user = auth.currentUser;
  const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, slots, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, currencySymbol, country } = useFirebase();
  const [isCheckLoading, setIsCheckLoading] = useState(false);
  
   // Example non-decimal number
   const formattedDailyDropsBalance = (Number(dailyDropBalance) + 0.0).toFixed(2); // Convert to decimal and round to two decimal places
   const formattedReferralBalance = (Number(referralsBalance) + 0.0).toFixed(2);
   const formattedAdRevenue = (Number(adRevenue) + 0.0).toFixed(2);
   const formattedBalance  = (Number(userBalance) + 0.0).toFixed(2);
   const formattedDeposit  = (Number(deposit) + 0.0).toFixed(2);
 
const CustomLink = ({ to, children, ...props }) => {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? 'active' : ''}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
};

  const initializeTooltip = (element) => {
    if (element) {
      const tooltip = new window.bootstrap.Tooltip(element, {
        placement: 'top', // Adjust placement as needed
        title: element.title,
      });
    }
  };

  
  const tooltipRefTrophy = useRef();
  const tooltipTitleTrophy = `Events`;


  useEffect(() => {
    initializeTooltip(tooltipRefTrophy.current);
  }, []);
  
  useEffect(() => {
    // Remove the 'new' key from localStorage
    localStorage.removeItem('new');
  }, []);

  const boxStyle = {
    width: '85%',
    marginLeft: '16.5%',
    marginRight: '3.5%',
    height: '400px',
    backgroundColor: '#1F222D', // White background color
    color: '#ffff', // Text color
    textAlign: 'center',
    padding: '5px',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', // Box shadow
  };

  const userStyle = {
    fontSize: '15px',
  };

  const accBox = {
    height: '110px',
    width: '100%',
    marginTop: '5px',
    color: '#fff'
  }

  const smaller = {
    fontSize: '14px'
  }

  const avatar ={
    height: '2rem',
    width: '2rem',
    borderRadius: '50%'
  }
  const taskBoxStyle = {
    width: '85%',
    marginLeft: '16.5%',
    marginRight: '3.5%',
    height: '330px',
    backgroundColor: '#1F222D', // White background color
    color: '#000', // Text color
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', // Box shadow
  };

  const moreOptions = {
    width: '85%',
    marginLeft: '16.5%',
    marginRight: '3.5%',
    height: '170px',
    backgroundColor: '#1F222D',
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', // Box shadow

  }

  const pointer = {
    cursor: 'pointer'
  }

  return (
   <>
   <ToastContainer />
    <div className=' home-container'>
      <div className='container'>
      <div style={boxStyle} className='border-top-theme tt-Box'>
        <div className="d-flex justify-content-end align-items-center">
          <img src={userImg} style={avatar} className='img-fluid d-block mx-1'/><h3 style={userStyle} className='text-end'>{userFullName}</h3>
        </div>
        {/* first row */}
    <div className='row'>
      <div className='col-6'>
          <div className="card bg-secondary" style={accBox}>
            <div className="card-body">
              <h5 className="d-flex align-items-center" style={userStyle}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="currentColor"
                className="bi bi-wallet2"
                viewBox="0 0 16 16"
              >
                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
              </svg>
              <span className='mx-1'>Account balance</span></h5>
              <p className="card-text display-6" style={smaller}><FeeItem amountInUSD={userBalance} />{currencySymbol}</p>
            </div>
          </div>
      </div>
      <div className='col-6'>
          <div className="card bg-secondary" style={accBox}>
            <div className="card-body">
              <h5 className="d-flex align-items-center" style={userStyle}><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-currency-exchange" viewBox="0 0 16 16">
               <path d="M0 5a5.002 5.002 0 0 0 4.027 4.905 6.46 6.46 0 0 1 .544-2.073C3.695 7.536 3.132 6.864 3 5.91h-.5v-.426h.466V5.05c0-.046 0-.093.004-.135H2.5v-.427h.511C3.236 3.24 4.213 2.5 5.681 2.5c.316 0 .59.031.819.085v.733a3.46 3.46 0 0 0-.815-.082c-.919 0-1.538.466-1.734 1.252h1.917v.427h-1.98c-.003.046-.003.097-.003.147v.422h1.983v.427H3.93c.118.602.468 1.03 1.005 1.229a6.5 6.5 0 0 1 4.97-3.113A5.002 5.002 0 0 0 0 5zm16 5.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0zm-7.75 1.322c.069.835.746 1.485 1.964 1.562V14h.54v-.62c1.259-.086 1.996-.74 1.996-1.69 0-.865-.563-1.31-1.57-1.54l-.426-.1V8.374c.54.06.884.347.966.745h.948c-.07-.804-.779-1.433-1.914-1.502V7h-.54v.629c-1.076.103-1.808.732-1.808 1.622 0 .787.544 1.288 1.45 1.493l.358.085v1.78c-.554-.08-.92-.376-1.003-.787H8.25zm1.96-1.895c-.532-.12-.82-.364-.82-.732 0-.41.311-.719.824-.809v1.54h-.005zm.622 1.044c.645.145.943.38.943.796 0 .474-.37.8-1.02.86v-1.674l.077.018z"/>
              </svg>
              <span className='mx-1'>Returns</span></h5>
              <p className="card-text display-6" style={smaller}><FeeItem amountInUSD={dailyDropBalance} />{currencySymbol}</p>
            </div>
          </div>
      </div>
    </div>
    {/* second row */}
    <div className='row'>
      <div className='col-6'>
          <div className="card bg-secondary" style={accBox}>
            <div className="card-body">
              <h5 className="d-flex align-items-center" style={userStyle}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-piggy-bank-fill" viewBox="0 0 16 16">
                  <path d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069q0-.218-.02-.431c.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a1 1 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.74.74 0 0 0-.375.562c-.024.243.082.48.32.654a2 2 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595m7.173 3.876a.6.6 0 0 1-.098.21l-.044-.025c-.146-.09-.157-.175-.152-.223a.24.24 0 0 1 .117-.173c.049-.027.08-.021.113.012a.2.2 0 0 1 .064.199m-8.999-.65a.5.5 0 1 1-.276-.96A7.6 7.6 0 0 1 7.964 3.5c.763 0 1.497.11 2.18.315a.5.5 0 1 1-.287.958A6.6 6.6 0 0 0 7.964 4.5c-.64 0-1.255.09-1.826.254ZM5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0"/>
                </svg>
              <span className='mx-1'>Total withdraw</span></h5>
              <p className="card-text display-6" style={smaller}><div><span>0 </span></div>{currencySymbol}</p>
            </div>
          </div>
      </div>
      <div className='col-6'>
          <div className="card bg-secondary" style={accBox}>
            <div className="card-body">
              <h5 className="d-flex align-items-center" style={userStyle}>
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-hourglass-split" viewBox="0 0 16 16">
                <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z"/>
              </svg>
              <span className='mx-1'>Total deposit</span></h5>
              <p className="card-text display-6" style={smaller}><FeeItem amountInUSD={deposit} />{currencySymbol}</p>
            </div>
          </div>
      </div>
    </div>
    {/* third row */}
    <div className='row'>
      <div className='col-6'>
          <div className="card bg-secondary" style={accBox}>
            <div className="card-body">
              <h5 className="d-flex align-items-center" style={userStyle}><svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-cash-stack"
                viewBox="0 0 16 16"
              >
                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z" />
              </svg>
              <span className='mx-1'>Total investment</span></h5>
              <p className="card-text display-6" style={smaller}><FeeItem amountInUSD={deposit} />{currencySymbol}</p>
            </div>
          </div>
      </div>
      <div className='col-6'>
          <div className="card bg-secondary" style={accBox}>
            <div className="card-body">
              <h5 className="d-flex align-items-center" style={userStyle}><svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                className="bi bi-cash-stack"
                viewBox="0 0 16 16"
              >
                <path d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1H1zm7 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                <path d="M0 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V7a2 2 0 0 1-2-2H3z" />
              </svg>
              <span className='mx-1'>Referral earnings</span></h5>
              <p className="card-text display-6" style={smaller}><FeeItem amountInUSD={referralsBalance} />{currencySymbol}</p>
            </div>
          </div>
      </div>
    </div>
    {/* end of top box */}
    </div>
    <>
      <div className='taskBox border-top-theme mt-5' style={taskBoxStyle}>
      <TradingViewWidget/>
      </div>
    </>
    {/* end of task box */}
    <div className='moreOptions border-top-theme mt-5 mb-3 text-white p-4' style={moreOptions}>
      <h5>More options</h5>
      <div className='row'>
        <div className='col-sm-6 d-flex  sm-justify'>
        <div className='d-block align-items-center justify-content-center text-center'>
          
          <Link className='rounded-pill bg-secondary p-2 mx-4' style={pointer} type="button"  data-html="true" to="/investment_plans">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-bar-down" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5M8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6"/>
          </svg>
          </Link>
          <p className='fw-bold' style={smaller}>Add deposit</p>
          </div>
          {/*  */}
          <div className='d-block align-items-center justify-content-center text-center'>
            
          <Link className='rounded-pill bg-secondary p-2 mx-4' style={pointer} type="button"  data-html="true" to="/investment_plans">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-graph-up-arrow" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5"/>
          </svg>
          </Link>
          <p className='fw-bold' style={smaller}>Invest</p>
          </div>
        </div>
        {/*  */}
          <div className='col-sm-6 d-flex  sm-justify'>
          <div className='d-block align-items-center justify-content-center text-center'>
          
          <Link className='rounded-pill bg-secondary p-2 mx-4' style={pointer} type="button"  data-html="true" to="withdraw">
           <svg width="30" height="30" fill="currentColor" viewBox="0 0 16 16" version="1.1">
              <path fill="currentColor" d="M8 0l2 3h-1v2h-2v-2h-1l2-3z"></path>
              <path fill="currentColor" d="M15 7v8h-14v-8h14zM16 6h-16v10h16v-10z"></path>
              <path fill="currentColor" d="M8 8c1.657 0 3 1.343 3 3s-1.343 3-3 3h5v-1h1v-4h-1v-1h-5z"></path>
              <path fill="currentColor" d="M5 11c0-1.657 1.343-3 3-3h-5v1h-1v4h1v1h5c-1.657 0-3-1.343-3-3z"></path>
            </svg>
          </Link>
          <p className='fw-bold' style={smaller}>Withdraw</p>
          </div>
          {/*  */}
          <div className='d-block align-items-center justify-content-center text-center'>
            
          <Link className='rounded-pill bg-secondary p-2 mx-4' style={pointer} type="button"  data-html="true" to="/profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
            </svg>
          </Link>
          <p className='fw-bold' style={smaller}>Profile</p>
          </div>
          </div>
        {/*  */}
      </div>
    </div>
      </div>
      </div>
    </>
      
  );
}

export default Home;