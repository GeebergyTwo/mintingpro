import React, { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUser } from '../functionalComponents/UserRoleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import useCurrencyConverter from '../functionalComponents/useCurrencyConverter';

const MintPower = () => {
  const { userData, handleGetUser } = useUser();
  const balance = userData?.balance || 0;
  const initialMintedAmount = balance / 1.8; // amount minted by user so far in tokens (total)
  const [amountMinted, setAmountMinted] = useState(initialMintedAmount);
  const ratePerSecond = userData?.mint_rate || 0; // mint rate of user from db in naira
  const convertedRate = ratePerSecond / 1.8; // converted rate to tokens
  const displayRate = convertedRate / 100; // Smaller amount to mint per tick
  const updateInterval = 100; // Update every 100 milliseconds

  const [currency, setCurrency] = useState('USD'); // Set USD as default


  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
    console.log("Selected Currency:", e.target.value); // You can use this for any additional logic
  };


  const timerRef = useRef(null);

  // Increase the amount minted rapidly by updating frequently
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAmountMinted((prev) => prev + displayRate);
    }, updateInterval);

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(timerRef.current);
    };
  }, [userData]);

  const secondsInWeek = 604800; // 60 * 60 * 24 * 7
  const secondsInMonth = 2592000; // 60 * 60 * 24 * 30

  const weeklyMint = ratePerSecond * secondsInWeek;
  const monthlyMint = ratePerSecond * secondsInMonth;

  const weeklyMintInTokens = convertedRate * secondsInWeek;
  const monthlyMintInTokens = convertedRate * secondsInMonth;

  // Get USD conversion for weekly and monthly mints
  const { usdAmount: weeklyMintInUSD, loading: weeklyLoading, error: weeklyError } = useCurrencyConverter(weeklyMint);
  const { usdAmount: monthlyMintInUSD, loading: monthlyLoading, error: monthlyError } = useCurrencyConverter(monthlyMint);

  const scrollContainer = {
    paddingBottom: '80px',
    paddingTop: '20px',
    minHeight: '100vh',
    boxSizing: 'border-box',
    background: 'linear-gradient(to bottom, #3c3f4c, #262A36)',
  };

  const yellowOrangeButtonStyle = {
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    color: 'white',
    background: '#FFA500',
    cursor: 'pointer',
    fontWeight: 'bold',
    display: 'block',
    marginLeft: 'auto',
  };

  const mintInfo = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px', // Add spacing between rows
  };

  const big = {
    fontSize: '20px',
  };

  const bigBold = {
    fontSize: '20px',
    fontWeight: 'bold',
  };

  const decNone = {
    textDecoration: 'none',
  };

  const inputStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '13px',
    backgroundColor: 'transparent',
    outline: 'none',
    // width: '100%',
  };

  // Helper function to format numbers as currency
  const formatCurrency = (number, decimals = 2) => {
    return Number(number.toFixed(decimals)).toLocaleString();
  };

  return (
    <div style={scrollContainer} className="pTop-80">
      <div className="main-content">
        <Container>
          <h1>Mint</h1>
          <Link to="/upgrade" style={decNone}>
            <button style={yellowOrangeButtonStyle}>Upgrade</button>
          </Link>

          {/* Mint Info */}
          <div style={mintInfo} className="mt-3">
            <p style={big}>Tokens Minted:</p>
            {!userData ? (
              <FontAwesomeIcon icon={faSpinner} spin />
            ):
            (
              <p style={bigBold}>{amountMinted.toFixed(4).toLocaleString()}</p>
            )}
            
          </div>
          <div style={mintInfo}>
            <p style={big}>Mint Power:</p>
            <p style={bigBold}>{convertedRate.toFixed(3)}/s</p>
          </div>
        </Container>
      </div>

      {/* MINT RATE */}
      <div className="main-content">
        <Container>
          <h1>Mint Rate</h1>
          <div>
            <select
              id="currency"
              value={currency}
              onChange={handleCurrencyChange}
              className='mb-3'
              style={{ ...inputStyle, fontWeight: 'bold', background: '#3F4254', color: 'white' }}
            >
              <option value="USD">Amount in USD</option>
              <option value="Naira">Amount in Local Currency</option>
              <option value="Tokens">Amount in Tokens</option>
            </select>
          </div>

          <div style={mintInfo}>
            <p style={big}>Weekly Mint:</p>
            <div style={bigBold}>
              {currency === 'Tokens' ? (
                <p>{formatCurrency(weeklyMintInTokens, 2)}</p>
              ) : currency === 'Naira' ? (
                <div>₦{formatCurrency(weeklyMint, 2)}</div>
              ) : (
                <div>
                  {weeklyLoading ? 'Loading...' : weeklyError ? `Error: ${weeklyError}` : `$${formatCurrency(weeklyMintInUSD, 2)}`}
                </div>
              )}
            </div> {/* Show 2 decimal places */}
          </div>

          <div style={mintInfo}>
            <p style={big}>Monthly Mint:</p>
            <div style={bigBold}>
              {currency === 'Tokens' ? (
                <p>{formatCurrency(monthlyMintInTokens, 2)}</p>
              ) : currency === 'Naira' ? (
                <div>₦{formatCurrency(monthlyMint, 2)}</div>
              ) : (
                <div>
                  {monthlyLoading ? 'Loading...' : monthlyError ? `Error: ${monthlyError}` : `$${formatCurrency(monthlyMintInUSD, 2)}`}
                </div>
              )}
            </div> {/* Show 2 decimal places */}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default MintPower;
