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

      const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, isTaskConfirmed, setIsTaskConfirmed, isTaskPending, setIsTaskPending, completedTasks, setCompletedTasks, isTaskPendingTwo, setIsTaskPendingTwo, isTaskConfirmedTwo, setIsTaskConfirmedTwo,  isTaskPendingThree, setIsTaskPendingThree, isTaskConfirmedThree, setIsTaskConfirmedThree, isTaskPendingFour, setIsTaskPendingFour, isTaskConfirmedFour, setIsTaskConfirmedFour, isTaskPendingFive, setIsTaskPendingFive, isTaskConfirmedFive, setIsTaskConfirmedFive,  isTaskDeclined, setIsTaskDeclined, isTaskDeclinedTwo, setIsTaskDeclinedTwo, isTaskDeclinedThree, setIsTaskDeclinedThree, isTaskDeclinedFour, setIsTaskDeclinedFour, isTaskDeclinedFive, setIsTaskDeclinedFive, isTaskActuallyConfirmed, setIsTaskActuallyConfirmed, isTaskActuallyConfirmedTwo, setIsTaskActuallyConfirmedTwo, isTaskActuallyConfirmedThree, setIsTaskActuallyConfirmedThree, isTaskActuallyConfirmedFour, setIsTaskActuallyConfirmedFour, isTaskActuallyConfirmedFive, setIsTaskActuallyConfirmedFive,  activeTaskOne, setActiveTaskOne, activeTaskTwo, setActiveTaskTwo, activeTaskThree, setActiveTaskThree, activeTaskFour, setActiveTaskFour, activeTaskFive, setActiveTaskFive } = useFirebase();

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
    <Container style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
         <ToastContainer />
      {/* User Details */}
      <Row className="mt-4">
      <h4 className='text-secondary'>Personal Info</h4>
        <Col>
          <Card>
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
                <span className={isUserActive ? 'alert alert-success' : 'alert alert-danger'}>{isUserActive && totalReferrals >= 9 && totalReferrals !== null ? 'Tier 3' : isUserActive && totalReferrals >= 6 && totalReferrals !== null ? 'Tier 2' : isUserActive ? 'Tier 1' : 'Inactive'}</span>
              </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Events Section */}
      <Row className="mt-4">
      <h4 className='text-secondary'>General Info</h4>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Events</Card.Title>
              <Card.Text>
              <Link className="d-flex align-items-center justify-content-between bold text-dark bold ctOne" to="/leaderboard">
                <span>Referral Contest</span>
                <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                </svg>
                </span>
              </Link>
              </Card.Text>
              <Card.Text>
              <Link className="d-flex align-items-center justify-content-between bold text-dark bold ctTwo" to="/leaderboard">
                <span>Weekly Raffle</span>
                <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                </svg>
                </span>
              </Link>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className='mt-5'>
  <h4 className='text-secondary'>Tier Limitations</h4>
  <Col>
    <div className="table-responsive"> {/* Wrap the table with a div with the "table-responsive" class */}
      <Table striped bordered>
        <thead>
          <tr>
            <th>Tier</th>
            <th>Withdrawal</th>
            <th>Referral Bonus</th>
            <th>Ad Bonus</th>
            <th>Minimum Withdrawal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tier 1</td>
            <td>Anytime (except ad bonuses)</td>
            <td>16%</td>
            <td>End of month</td>
            <td>500</td>
          </tr>
          <tr>
            <td>Tier 2</td>
            <td>Anytime (except ad bonuses)</td>
            <td>30%</td>
            <td>End of month</td>
            <td>250</td>
          </tr>
          <tr>
            <td>Tier 3</td>
            <td>Anytime</td>
            <td>30%</td>
            <td>Anytime</td>
            <td>100</td>
          </tr>
        </tbody>
      </Table>
    </div>
  </Col>
</Row>


      {/* Frequently Asked Questions (FAQ) Section */}
      <Row className="mt-5">
        <h4 className='text-secondary'>Help</h4>
        <p className='display-6'>FAQS</p>
        <Col>
        <div className="accordion"  id="accordionExample">
  {/* <!-- How to Earn --> */}
  <div className="accordion-item">
    <h2 className="accordion-header text-theme bold" id="headingOne">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        How to Earn
      </button>
    </h2>
    <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <p>
          You can earn money on Drip Dash through various methods:
        </p>
        <ul>
          <li>Daily Drops: Claim cash available on the platform every day.</li>
          <li>Watch Ads: Earn money by watching advertisements.</li>
          <li>Tasks: Perform tasks to earn money.</li>
          <li>Referral Contest: Refer others to earn a percentage of their deposits.</li>
          <li>Weekly Raffle: Participate in the weekly raffle for a chance to win prizes.</li>
        </ul>
        <p>
          Remember, you can also earn from referrals. You earn 16% of your referred users' deposits, whether it's in bitcoin or naira.
        </p>
      </div>
    </div>
  </div>

  {/* <!-- When can I withdraw my earnings --> */}
  <div className="accordion-item">
    <h2 className="accordion-header text-theme bold" id="headingTwo">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        When can I withdraw my earnings?
      </button>
    </h2>
    <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <p>
          You can withdraw your earnings anytime, except for the earnings from the ad balance, which are withdrawn at the end of the month. Users who are tier 2 or above are an exception to this rule.
        </p>
      </div>
    </div>
  </div>

  {/* <!-- Do I need referrals to withdraw --> */}
  <div className="accordion-item">
    <h2 className="accordion-header text-theme bold" id="headingThree">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Do I need referrals to withdraw?
      </button>
    </h2>
    <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <p>
          You can withdraw without the need for referrals, except for money earned from daily drops, which requires a minimum of three referrals to withdraw.
        </p>
      </div>
    </div>
  </div>

  {/* <!-- How much do I make per referral --> */}
  <div className="accordion-item">
    <h2 className="accordion-header text-theme bold" id="headingFour">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
        How much do I make per referral?
      </button>
    </h2>
    <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <p>
          Each user makes 16% to 40% of deposit per referral, depending on their tier.
        </p>
      </div>
    </div>
  </div>

  {/* <!-- How do I activate my account --> */}
  <div className="accordion-item">
    <h2 className="accordion-header text-theme bold" id="headingFive">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
        How do I activate my account?
      </button>
    </h2>
    <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <p>
          To activate your account, navigate to your wallet section in the navbar below, and there you can find the button to activate your account.
        </p>
      </div>
    </div>
  </div>

  {/* <!-- What are daily drops --> */}
  <div className="accordion-item">
    <h2 className="accordion-header text-theme bold" id="headingSix">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
        What are daily drops?
      </button>
    </h2>
    <div id="collapseSix" className="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <p>
          Daily drops are cash available for users with active accounts to claim every day on the platform.
        </p>
      </div>
    </div>
  </div>

  {/* <!-- Tier System --> */}
  <div className="accordion-item">
    <h2 className="accordion-header text-theme bold" id="headingSeven">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
        Tier System
      </button>
    </h2>
    <div id="collapseSeven" className="accordion-collapse collapse" aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <p>
          To move to a higher tier, you need to reactivate your account and make three referrals. Higher tiers come with higher withdrawal limits, more promos, bonuses, and other perks.
        </p>
        <p>
          For example, Tier 3 has a minimum withdrawal of 50 naira, and users in this tier can withdraw money from ads whenever they want.
        </p>
      </div>
    </div>
  </div>

  {/* <!-- Account Limit --> */}
  <div className="accordion-item">
    <h2 className="accordion-header text-theme bold" id="headingEight">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
        Account Limit
      </button>
    </h2>
    <div id="collapseEight" className="accordion-collapse collapse" aria-labelledby="headingEight" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <p>
          Account Limit is the maximum amount that can be withdrawn from your daily drops balance. Upon the first withdrawal, it's gradually increased. Higher tiers have higher limits, and it's boosted
          with each reactivation and three referrals, which also moves the user to the next tier.
        </p>
       </div>
    </div>

    </div>
    {/* Funding Account */}
    <div className="accordion-item">
    <h2 className="accordion-header text-theme bold" id="headingNine">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
        How To Fund My Account
      </button>
    </h2>
    <div id="collapseNine" className="accordion-collapse collapse" aria-labelledby="headingNine" data-bs-parent="#accordionExample">
      <div className="accordion-body">
      <h3>How to Fund Your Account:</h3>
    <ol>
        <li><strong>Navigate to Wallet:</strong> Click on the "Wallet" section in the navigation bar.</li>
        <li><strong>Check Bonus Balance:</strong> Once in the Wallet section, locate the "Bonus Balance" section.</li>
        <li><strong>Fund Your Wallet:</strong> In the "Bonus Balance" section, you will find a button to fund your wallet. Click on it.</li>
        <li><strong>Input Amount:</strong> Enter the amount you intend to fund your wallet with.</li>
        <li><strong>Make Payment:</strong> Follow the prompts to complete the payment process.</li>
        <li><strong>Account Funded:</strong> After successful payment, your account will be funded with the specified amount.</li>
    </ol>
       </div>
    </div>

    </div>
    {/*  */}
    <div className="accordion-item">
    <h2 className="accordion-header text-theme bold" id="headingTen">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
        About Wallet Balances
      </button>
    </h2>
    <div id="collapseTen" className="accordion-collapse collapse" aria-labelledby="headingTen" data-bs-parent="#accordionExample">
      <div className="accordion-body">
        <p><strong>Ad Balance:</strong> This balance consists of earnings from watching ads. Withdrawals from this balance are subject to the tier system, as shown above.</p>
        <p><strong>Bonus Balance:</strong> The Bonus Balance includes earnings from promos, referrals, funding your wallet, and other sources. It can be withdrawn anytime with no limits for all users.</p>
        <p><strong>Daily Drops Balance:</strong> Money from Daily Drops accumulates in this balance. It becomes available for withdrawal after a user has a minimum of 3 referrals.</p>
       </div>
    </div>

    </div>
    {/*  */}
</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
