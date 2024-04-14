import React from 'react';
import { Container, Row, Col, Card, Accordion, Button, Table} from 'react-bootstrap';
import {Link, useMatch, useResolvedPath, useNavigate} from 'react-router-dom';
import { useFirebase } from './UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
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

      const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, slots, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, currencySymbol, country} = useFirebase();

      const handleCopy = () => {
        // Create a temporary input element to facilitate copying
        const tempInput = document.createElement('input');
        
        // Set the value of the input to the referral ID
        tempInput.value = `https://dripdash.netlify.app/login?ref=${referralCode}`;
        
        // Append the input element to the DOM (not visible)
        document.body.appendChild(tempInput);
        
        // Select the text in the input
        tempInput.select();
        
        // Execute the copy command
        document.execCommand('copy');
        
        // Remove the temporary input element from the DOM
        document.body.removeChild(tempInput);
    
        // Optionally, provide feedback to the user (e.g., a tooltip or notification)
        toast.info('Referral link copied to clipboard!', {
          position: toast.POSITION.TOP_CENTER,
        });
      };

      const handleCopyCode = () => {
        // Create a temporary input element to facilitate copying
        const tempInput = document.createElement('input');
        
        // Set the value of the input to the referral ID
        tempInput.value = referralCode;
        
        // Append the input element to the DOM (not visible)
        document.body.appendChild(tempInput);
        
        // Select the text in the input
        tempInput.select();
        
        // Execute the copy command
        document.execCommand('copy');
        
        // Remove the temporary input element from the DOM
        document.body.removeChild(tempInput);
    
        // Optionally, provide feedback to the user (e.g., a tooltip or notification)
        toast.info('Referral Code copied to clipboard!', {
          position: toast.POSITION.TOP_CENTER,
        });
      };
      
  return (
    <div className='container-fluid' style={{ background: '#13151b', height: '100%', width: '100%', position: 'absolute', overflowY: 'auto', overflowX: 'hidden', marginBottom: '80px' }}>
         <ToastContainer />
      {/* User Details */}
      <Row className="mt-4" style={{ width: '85%', marginLeft: '16.5%', marginRight: '3.5%'}}>
      <h4 className='text-secondary'>Personal Info</h4>
        <Col>
          <Card className='text-secondary' style={{background: '#1F222D', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>
            <Card.Body>
              <Card.Title>User Details</Card.Title>
              <Card.Text>
              <div className="ride-detail__user-avatar">
                <img src={userImg} />
              </div>
              {/*  */}
              <div className='d-flex align-items-center justify-content-between border-bottom border-gray p-2 mb-2'>
                <span>Username:</span>
                <span>{userFullName}</span>
              </div>
              {/*  */}
              {/*  */}
              <div className='d-flex align-items-center justify-content-between border-bottom border-gray p-2 mb-2'>
                <span>Country:</span>
                <span>{country}</span>
              </div>
              {/*  */}
              <div className='d-flex align-items-center justify-content-between border-bottom border-gray p-2 mb-2'>
                <span>Referrals:</span>
                <span>{referredUsers}</span>
              </div>
              {/*  */}
              <div className='d-flex align-items-center justify-content-between border-bottom border-gray p-2 mb-2'>
                <span>Referral Link:</span>
                <button className='remove-btn-style' onClick={handleCopy}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
                  </svg></button>
              </div>
              {/*  */}
              <div className='d-flex align-items-center justify-content-between border-bottom border-gray p-2 mb-2'>
                <span>Referral Code:</span>
                <button className='remove-btn-style' onClick={handleCopyCode}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-copy" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
                  </svg></button>
              </div>
              {/*  */}
              <div className='d-flex align-items-center justify-content-between border-bottom border-gray p-2 mb-2'>
                <span>Account Status:</span>
                <span className={isUserActive ? 'alert alert-success' : 'alert alert-danger'}>
                  {isUserActive ? (
                    'Active'
                  ) : (
                    'Inactive'
                  )}
                </span>
              </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    
    </div>
  );
};

export default Dashboard;
