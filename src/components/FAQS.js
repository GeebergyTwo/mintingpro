import React from 'react';
import { Container, Table } from 'react-bootstrap'; // Import only used components
import Accordion from 'react-bootstrap/Accordion';

const FAQS = () => {

  const scrollContainer = {
    paddingBottom: '80px',
    paddingTop: '20px',
    minHeight: '100vh', // Ensures content takes at least the full height of the viewport
    boxSizing: 'border-box',
    background: 'linear-gradient(to bottom, #3c3f4c, #262A36)', // Gradient from dark purple to a lighter purple
  };

  const faqItemStyle = {
    backgroundColor: '#3F4254',
    color: '#FFFFFF',
    border: 'none',
    // boxShadow: '0 4px 8px rgba(109, 0, 255, 0.5)', 
  };

  const headerStyle = {
    backgroundColor: '#3F4254',
    color: '#FFFFFF',
    border: 'none',
    fontWeight: 'bold',
  };

  const formatCurrency = (number, decimals = 2) => {
    return Number(number.toFixed(decimals)).toLocaleString();
  };

  return (
    <div style={scrollContainer} className='pTop-80'>
      <div className="main-content">
        <Container>
        <h2>Frequently Asked Questions</h2>
        <Accordion>
  {/* Existing Questions */}
  <Accordion.Item eventKey="0" style={faqItemStyle}>
  <Accordion.Header style={headerStyle}>Tier Perks and Limits (Levels)</Accordion.Header>
  <Accordion.Body>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Level</th>
          <th>Base Plan</th>
          <th>Max Level Upgrade</th>
          <th>Mint Rate/Mint Power (Token per second)</th>
          <th>Weekly Mint (In your local currency)</th>
          <th>Monthly Mint (In your local currency)</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(15).keys()].map((index) => {
          const level = index + 1;
          const mintPower = 0.05 + (0.01 * (level - 1)); // Start from 0.05 and increment by 0.01 per level
          const mintPowerInTokens = mintPower / 1.8;
          const secondsInWeek = 604800; // 60 * 60 * 24 * 7
          const secondsInMonth = 2592000; // 60 * 60 * 24 * 30
          
          const weeklyMint = mintPower * secondsInWeek;
          const monthlyMint = mintPower * secondsInMonth;
          
          let basePlan = '';
          let maxLevel = '';

          // Assign base plan and max level based on the current level
          if (level >= 1 && level <= 4) {
            basePlan = 'Standard Mint';
            maxLevel = 'Could be upgraded to level 4 with referrals';
          } else if (level >= 5 && level <= 9) {
            basePlan = 'Premium Mint';
            maxLevel = 'Could be upgraded to level 9 with referrals';
          } else if (level >= 10 && level <= 15) {
            basePlan = 'Ultimate Mint';
            maxLevel = 'Could be upgraded to level 15 with referrals';
          }

          return (
            <tr key={level}>
              <td>{level}</td>
              <td>{basePlan}</td>
              <td>{maxLevel}</td>
              <td>{mintPowerInTokens.toFixed(3)}</td> {/* Mint Rate */}
              <td>₦{formatCurrency(weeklyMint, 2)}</td> {/* Weekly Mint with commas */}
              <td>₦{formatCurrency(monthlyMint, 2)}</td> {/* Monthly Mint with commas */}
            </tr>
          );
        })}
      </tbody>
    </Table>
    <p>These levels represent the tier limits and can be upgraded through referrals.</p>
  </Accordion.Body>
</Accordion.Item>



  <Accordion.Item eventKey="1" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What is minting?</Accordion.Header>
    <Accordion.Body>
      Minting is the process of producing currency or coins for circulation. In the context of our platform, minting refers to the generation of digital currency or points, much like how banks mint physical currency. Just like mining in the cryptocurrency world, where digital coins are created, minting on our platform involves generating currency through specific processes, and users are rewarded for participating in these processes.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="2" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How can I get started?</Accordion.Header>
    <Accordion.Body>
      To get started with minting, you should navigate to your Upgrade Mint page. There, you'll find the steps required to activate your account and begin the minting process. Follow the instructions provided, and you'll be on your way to earning through minting.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="3" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What are mint points?</Accordion.Header>
    <Accordion.Body>
      Mint points are special points earned by completing tasks and referring users on our platform. These points hold significant value, even more than local currency and can be converted into your local currency and withdrawn at any time.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="34" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How much do I make per referral?</Accordion.Header>
    <Accordion.Body>
      You receive 1000 points for each referral. 1000 points is equal to ₦1,200 in your local currency after conversion.
      <p><span className='fw-bold'>Note: </span>Conversions are done automatically in the app and are subject to change</p>
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="35" style={faqItemStyle}>
  <Accordion.Header style={headerStyle}>How can I exchange my tokens?</Accordion.Header>
  <Accordion.Body>
    You can withdraw your tokens directly from the withdrawal page, converting them to your local currency. Alternatively, you can send your tokens to another Mint Pro wallet address using the 'Send and Receive' section.
  </Accordion.Body>
</Accordion.Item>

<Accordion.Item eventKey="36" style={faqItemStyle}>
  <Accordion.Header style={headerStyle}>How to do tasks?</Accordion.Header>
  <Accordion.Body>
    Navigate to your home page where you'll find available tasks, along with the points allocated for completing each of them. After finishing a task, take a screenshot as proof and upload it. Your submission will undergo a manual review, and if approved, the points will be credited to your account within 12 hours.
  </Accordion.Body>
</Accordion.Item>

<Accordion.Item eventKey="37" style={faqItemStyle}>
  <Accordion.Header style={headerStyle}>How to send and receive tokens?</Accordion.Header>
  <Accordion.Body>
    Go to the 'Send and Receive' page to find your wallet address. To receive tokens, copy this address and share it with the sender, who will paste it in their transfer field. The tokens will be disbursed and reflected in your account within 12 hours. To send tokens, paste the recipient's wallet address into the transfer field along with the amount, confirm the address, and complete the transfer. The recipient will see the tokens in their wallet within 12 hours.
  </Accordion.Body>
</Accordion.Item>


  <Accordion.Item eventKey="4" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What is the holding period?</Accordion.Header>
    <Accordion.Body>
      The holding period is the minimum time required for you to mint and hold your currency before you can make a withdrawal. This period is set according to guidelines to ensure the stability and integrity of the minting process.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="5" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>When can I withdraw (when is my payment date)?</Accordion.Header>
    <Accordion.Body>
      You can withdraw your mint points at any time; however, there is a minimum holding period of 2 months for minted balance after activating your account. After this period, you are free to withdraw your mint balance at your convenience.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="6" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How to withdraw?</Accordion.Header>
    <Accordion.Body>
      To withdraw your points or balance, navigate to your Withdrawal page. There, you'll find the options to withdraw either your mint points or your balance. Simply select the desired option, input your bank details, and complete the process to withdraw your funds.
    </Accordion.Body>
  </Accordion.Item>

  {/* New Questions */}
  <Accordion.Item eventKey="7" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>Where is my referral code?</Accordion.Header>
    <Accordion.Body>
      To find your referral code, navigate to your profile where you will find the option to copy your referral code.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="35" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How can I refer?</Accordion.Header>
    <Accordion.Body>
      To refer someone, navigate to your profile page where you will find a button to copy your referral code. Send this code to anyone you'd like to refer. Once they click the link and sign up, they will appear as an inactive referral on your profile until they start minting by activating a minting plan.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="8" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What is an inactive referral?</Accordion.Header>
    <Accordion.Body>
      An inactive referral refers to users who signed up using your referral link but have not started minting yet.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="9" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What is an active referral?</Accordion.Header>
    <Accordion.Body>
      Active referrals are users who have signed up using your referral link and have started minting on the platform.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="10" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How to activate my account?</Accordion.Header>
    <Accordion.Body>
      To activate your account, navigate to the Upgrade Mint page and select a minting plan. Each plan offers different perks, and activating a plan will start your minting process.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="11" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How to start minting?</Accordion.Header>
    <Accordion.Body>
      To start minting, you need to activate your account by choosing a minting plan on the Upgrade Mint page. Once activated, your account will automatically begin minting, and you can refer others to progress to the next level.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="12" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What is mint power/mint rate?</Accordion.Header>
    <Accordion.Body>
      Mint power or mint rate is the amount of money you mint per second. Once you activate your account with a minting plan, minting begins automatically. Higher levels come with higher mint rates/mint power.
    </Accordion.Body>
  </Accordion.Item>

  <Accordion.Item eventKey="13" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How to upgrade my level?</Accordion.Header>
    <Accordion.Body>
      You can upgrade your level by referring three users. Each set of three referrals moves you to the next level. Alternatively, you can upgrade to a higher level by selecting a higher minting plan.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 1 */}
  <Accordion.Item eventKey="14" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How can I withdraw my points?</Accordion.Header>
    <Accordion.Body>
      Points follow the same process as normal withdrawals and are automatically converted when withdrawing. 1000 points equal ₦1200 in your local currency after conversion.
      <p><span className='fw-bold'>Note: </span>Conversions are done automatically in the app and are subject to change</p>
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 2 */}
  <Accordion.Item eventKey="15" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What is minting power and how does it affect my earnings?</Accordion.Header>
    <Accordion.Body>
      Minting power is how much your account makes per second. The higher the minting power, the more currency you generate.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 3 */}
  <Accordion.Item eventKey="16" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How are referrals tracked and rewarded?</Accordion.Header>
    <Accordion.Body>
      You can check how many referrals you have in your profile, and you receive points for each active referral.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 4 */}
  <Accordion.Item eventKey="17" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>Can I upgrade my minting plan without referrals?</Accordion.Header>
    <Accordion.Body>
      You can increase your minting plan by choosing a higher minting plan, even after activating your account (choosing the initial minting plan).
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 5 */}
  <Accordion.Item eventKey="18" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How long does it take to see the minted balance in my account?</Accordion.Header>
    <Accordion.Body>
      The minted balance reflects in real time as you mint.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 6 */}
  <Accordion.Item eventKey="19" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>Is there a limit to how many users I can refer?</Accordion.Header>
    <Accordion.Body>
      There is no limit to how many users you can refer.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 7 */}
  <Accordion.Item eventKey="20" style={headerStyle}>
    <Accordion.Header style={headerStyle}>Are there fees associated with withdrawals?</Accordion.Header>
    <Accordion.Body>
      There are no fees associated with withdrawals.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 8 */}
  <Accordion.Item eventKey="21" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What happens if I don’t reach the referral goal for a level upgrade?</Accordion.Header>
    <Accordion.Body>
      Your account will stay on the current level and at the same mint rate.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 9 */}
  <Accordion.Item eventKey="22" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>Can I mint using multiple plans at the same time?</Accordion.Header>
    <Accordion.Body>
      You can only use one minting plan at a time, but you can choose to upgrade to a higher minting plan at any time for less than the initial amount, as the first payment is credited to the website.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 10 */}
  <Accordion.Item eventKey="23" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How do I know what my current minting level is?</Accordion.Header>
    <Accordion.Body>
      Your current minting level is reflected on your profile, home screen, and the mint page.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 11 */}
  <Accordion.Item eventKey="24" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>Is my minted balance secure?</Accordion.Header>
    <Accordion.Body>
      Yes, your minted balance is secure.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 12 */}
  <Accordion.Item eventKey="25" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>Can I change my minting plan after activation?</Accordion.Header>
    <Accordion.Body>
      Yes, you can change your minting plan for less than the initial amount due to the initial activation. The first deposit is subtracted from the cost of the other plans.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 13 */}
  <Accordion.Item eventKey="26" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What is the difference between Standard, Premium, and Ultimate Mint plans?</Accordion.Header>
    <Accordion.Body>
      Please refer to the tier perks and limits at the top of this page for a detailed breakdown.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 14 */}
  <Accordion.Item eventKey="27" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>Is there a minimum withdrawal amount?</Accordion.Header>
    <Accordion.Body>
      Yes, the minimum withdrawal amount should equal to or be more than ₦500 in your local currency after conversion.
      <p><span className='fw-bold'>Note: </span>Conversions are done automatically in the app and are subject to change</p>
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 15 */}
  <Accordion.Item eventKey="28" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>How can I view my referral earnings?</Accordion.Header>
    <Accordion.Body>
      Your referral earnings are reflected as points on your home screen or dashboard. You earn 1000 points per referral.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 16 */}
  <Accordion.Item eventKey="29" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What are the perks of higher minting levels?</Accordion.Header>
    <Accordion.Body>
      Please refer to the 'Tier Limits and Perks' section at the top of this page.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 17 */}
  <Accordion.Item eventKey="30" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>Do referrals from different countries affect my minting power?</Accordion.Header>
    <Accordion.Body>
      No, referrals from different countries do not affect your minting power.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 18 */}
  <Accordion.Item eventKey="31" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>What happens if my referral becomes inactive?</Accordion.Header>
    <Accordion.Body>
      Referrals cannot become inactive. Once their account is activated, it actively mints until the end of the holding period.
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 19 */}
  <Accordion.Item eventKey="32" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>Support</Accordion.Header>
    <Accordion.Body>
      If you need assistance, please contact us at: support@yourplatform.com
    </Accordion.Body>
  </Accordion.Item>

  {/* Question 20 */}
  <Accordion.Item eventKey="33" style={faqItemStyle}>
    <Accordion.Header style={headerStyle}>Can I transfer my minted balance to another user?</Accordion.Header>
    <Accordion.Body>
      No, it is not possible to transfer your minted balance to another user.
    </Accordion.Body>
  </Accordion.Item>

</Accordion>

      </Container>
      </div>
    </div>
    
  );
};

export default FAQS;
