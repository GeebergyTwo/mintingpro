import { useContext, useRef, useEffect, useState, useCallback, Component } from 'react';
import { Container } from 'react-bootstrap';
import { useUser } from '../functionalComponents/UserRoleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import useCurrencyConverter from '../functionalComponents/useCurrencyConverter';
import axios from 'axios';

function SendAndReceive() {
  const { userData } = useUser();
  const walletAddress = userData?.walletAddress || '';
  const [receiverAddress, setReceiverAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');

  // Function to copy wallet address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    toast.info('Wallet address copied!', {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const amountInNaira = parseFloat(amount ? amount : 0) * 1.8;
  const { usdAmount: amountInUSD, loading: amountLoading, error: amountError } = useCurrencyConverter(amountInNaira);

  const scrollContainer = {
    paddingBottom: '80px',
    paddingTop: '20px',
    minHeight: '100vh', // Ensures content takes at least the full height of the viewport
    boxSizing: 'border-box',
    background: 'linear-gradient(to bottom, #3c3f4c, #262A36)', // Gradient from dark purple to a lighter purple
  };

  const inputStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '13px',
    backgroundColor: 'transparent',
    outline: 'none',
    width: '100%',
  };

  const gradientButtonStyle = {
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    marginTop: '10px',
    color: 'white',
    background: 'linear-gradient(to right, #6D00FF, #9F00FF)',
    cursor: loading ? 'not-allowed' : 'pointer', // Disable cursor if loading
  };

  // Helper function to format numbers as currency
  const formatCurrency = (number, decimals = 2) => {
    return Number(number.toFixed(decimals)).toLocaleString();
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!receiverAddress || !amountInNaira) {
      toast.error('Please enter all required fields.');
      setLoading(false);
      return;
    }


    try {
      const response = await axios.post('https://mintingpro.onrender.com/api/transfer', {
        senderId: userData._id, // Ensure this is available in your context
        receiverAddress,
        amount: amountInNaira,
      });

      toast.success(response.data.message);
      setReceiverAddress('');
      setAmount('');
      setLoading(false);
    } catch (error) {
      toast.error('Error processing transfer: ' + (error.response?.data?.error || 'Internal server error'));
      setLoading(false);
    }
  };

  return (
    <div style={scrollContainer} className='pTop-80'>
      <ToastContainer />
      {/* Main Content Area */}
      <div className="main-content">
        <Container>
          <h3>Your Wallet Address</h3>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#4A4D61', padding: '10px', borderRadius: '5px' }}>
            <input
              type="text"
              value={walletAddress}
              className='text-white'
              readOnly
              style={{ flex: 1, border: 'none', backgroundColor: 'transparent', fontSize: '14px' }}
            />
            <button onClick={copyToClipboard} style={{ marginLeft: '10px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faCopy} size="lg" color="#333" />
            </button>
          </div>
        </Container>
      </div>

      <div className='auto-adjust text-warning mt-4'>Tokens can only be exchanged on Minting Pro platforms due to service policy.</div>
      {/* Send box */}
      <div className="main-content mt-1">
        <Container>
          <h3>Input Receiver Address</h3>
          <p className='text-warning'>Make sure to confirm address before sending tokens.</p>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Enter wallet address"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                style={{ ...inputStyle, fontWeight: 'bold', color: 'white' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ ...inputStyle, fontWeight: 'bold', color: 'white' }}
              />
            </div>
            <div className='text-end fw-bold'>
              {amountLoading ? 'Loading...' : amountError ? `Error: ${amountError}` : `$${formatCurrency(amountInUSD, 2)}`}
            </div>
            <button type="submit" style={gradientButtonStyle}>
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin /> // Show spinner when loading
              ) : (
                'Send'
              )}
            </button>
          </form>
        </Container>
      </div>
    </div>
  );
}

export default SendAndReceive;
