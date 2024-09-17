import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useUser } from '../functionalComponents/UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

function Withdraw() {
  const [accountNameClass, setAccountNameClass] = useState('d-none');
  const [accountNameClassBalance, setAccountNameClassBalance] = useState('d-none');
  const [amount, setAmount] = useState('');
  const [amountBalance, setAmountBalance] = useState('');
  const [acct_number, setAcctNumber] = useState('');
  const [acct_numberBalance, setAcctNumberBalance] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientNameBalance, setRecipientNameBalance] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [convertedTokens, setConvertedTokens] = useState('');
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedBankBalance, setSelectedBankBalance] = useState('');
  const [transferResponse, setTransferResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { userData, handleGetUser } = useUser();

  const storedUserId = localStorage.getItem('auth');
  // Fetch user data on component mount
  useEffect(() => {
    if (!userData) {
      handleGetUser(storedUserId).then(() => {
        // setLoading(false);
      });
    } else {
      // setLoading(false);
    }
  }, [userData, handleGetUser]);


  useEffect(() => {
    // Fetch list of Nigerian banks
    const fetchBanks = async () => {
      try {
        const response = await axios.get(
          'https://api.paystack.co/bank'
        );

        setBankList(response.data.data);
      } catch (error) {
        console.error('Error fetching banks:', error.response);
      }
    };

    fetchBanks();
  }, []);


  // Dummy function to handle 'Max' button click
  const handleMaxClick = () => {
    setAmount(userData?.mint_points || 0); // Replace with actual logic to fetch max amount
  };

  const handleMaxClickBalance = () => {
    setAmountBalance(userData?.balance / 1.8 || 0); // Replace with actual logic to fetch max amount
  };

  // Dummy function to simulate currency conversion
  const convertCurrency = (value) => {
    // Placeholder for actual conversion logic
    const conversionRate = 1.2; // Example conversion rate
    return (parseFloat(value) * conversionRate).toFixed(2);
  };

  const convertTokens = (value) => {
    // Placeholder for actual conversion logic
    const conversionRate = 1.8; // Example conversion rate
    return (parseFloat(value) * conversionRate).toFixed(2);
  };

  // Update the converted amount whenever the input changes
  useEffect(() => {
    if (amount) {
      setConvertedAmount(convertCurrency(amount));
    } else {
      setConvertedAmount('');
    }
    if (amountBalance) {
      setConvertedTokens(convertTokens(amountBalance));
    } else {
      setConvertedTokens('');
    }
    
  }, [amount, amountBalance]);

  // handle transactions
  const saveTransactionData = async (transactionReference, email, amount, userID, status) => {
    const txDetails = {
      transactionReference: transactionReference,
      email,
      amount,
      userID,
      status,
      planType : 'Withdrawal', // Save the plan type
      timestamp: new Date(),
      description: 'Withdrawal',
      transactionType: 'debit',
    };
  
    try {
      const response = await axios.post(
        'http://localhost:3003/api/createTransaction',
        txDetails, // Automatically handles stringification
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status !== 200) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      console.log('Transaction data saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving transaction data:', error.message);
    }
  };

  // DEBIT THE USER AFTER TRANSACTION
  const handleDebit = async (e) => {
    e.preventDefault();
    
    if (!convertedAmount || convertedAmount <= 0) {
      toast.error('Please enter a valid debit amount');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3003/api/debitMintPoints', {
        userID: userData._id,
        debitAmount: parseFloat(convertedAmount)
      });

      // Update mint points
      // setMintPoints(response.data.mint_points);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error debiting mint points:', error);
      toast.error(error.response?.data?.message || 'Error withdrawing mint points');
    } finally {
      setLoading(false);
    }
  };

  // Function to validate the user's mint_points before proceeding
const validateUserTransaction = async (withdrawAmount, userMintPoints) => {
  if (withdrawAmount <= 0) {
    toast.warning('Withdrawal amount must be greater than zero', {
      position: toast.POSITION.TOP_CENTER,
    });
    return false;
  }

  if (userMintPoints < withdrawAmount) {
    toast.warning('Insufficient mint points for this withdrawal', {
      position: toast.POSITION.TOP_CENTER,
    });
    return false;
  }

  return true; // Validation passed
};

// Example function for handling withdrawal
const handleWithdrawal = async () => {
  setLoading(true);
  const withdrawAmount = parseFloat(convertedAmount); // Assuming `convertedAmount` is the amount to withdraw
  const userMintPoints = userData.mint_points; // Replace with user's actual mint_points, maybe from state or API call

  // Validate the transaction before proceeding
  const isEligible = await validateUserTransaction(withdrawAmount, userMintPoints);

  if (isEligible) {
    // If the user is eligible for withdrawal, proceed with the transfer
    handleTransfer();
  } else {
    // If not eligible, show a warning or take some other action
    console.log('User not eligible for withdrawal');
    setLoading(false);
  }
};


  // CODE FOR WITHDRAWAL
  const handleTransfer = async () => {
    try {
      const paystackKey = 'sk_live_e20784823c0d42753c00d76109b3ddf986f33291';

      

      // Find the selected bank code
      const selectedBankObject = bankList.find(
        (bank) => bank.name === selectedBank
      );

      if (!selectedBankObject) {
        console.error('Selected bank not found in the bank list');
        toast.warning('Selected bank not found in the bank list', {
          position: toast.POSITION.TOP_CENTER,
        });
        setLoading(false);
        return;
      }

      const bankCode = selectedBankObject.code;

      // Create a recipient for the transfer
      const createRecipientResponse = await axios.post(
        'https://api.paystack.co/transferrecipient',
        {
          type: 'nuban',
          name: recipientName,
          account_number: acct_number,
          bank_code: bankCode,
          currency: 'NGN',
        },
        {
          headers: {
            Authorization: `Bearer ${paystackKey}`,
          },
        }
      );


      const recipientCode = createRecipientResponse.data.data.recipient_code;
      const percentageCut = 0 * convertedAmount;
      const percentageCutAmount = parseFloat(convertedAmount) - parseFloat(percentageCut);
      const description = 'MintingPro-';
      const reference = uuidv4();
      // Initiate the transfer
      const initiateTransferResponse = await axios.post(
        'https://api.paystack.co/transfer',
        {
          source: 'balance',
          reason: description || 'Withdrawal',
          amount: percentageCutAmount * 100, // Paystack API requires the amount in kobo
          recipient: recipientCode,
          reference: 'tx' + reference,
        },
        {
          headers: {
            Authorization: `Bearer ${paystackKey}`,
          },
        }
      );

      setTransferResponse(initiateTransferResponse.data);
      saveTransactionData('tx' + reference, userData.email, percentageCutAmount, userData._id, 'success');
      handleDebit();
    } catch (error) {
      console.error('Error initiating transfer:', error.response.data);
      toast.warning(`Withdrawal not completed: Please confirm your details and try again`, {
        position: toast.POSITION.TOP_CENTER,
        toastId: 'toast-incomplete-fail',
      });
      setLoading(false);
    }
  };
  


  const scrollContainer = {
    paddingBottom: '80px',
    paddingTop: '20px',
    minHeight: '100vh', // Ensures content takes at least the full height of the viewport
    boxSizing: 'border-box',
    background: 'linear-gradient(to bottom, #3c3f4c, #262A36)', // Gradient from dark purple to a lighter purple
  };

  // Styles
  const inputStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '13px',
    backgroundColor: 'transparent',
    outline: 'none',
    width: '100%',
  };

  const buttonStyle = {
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    padding: '9px 11px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    backgroundColor: '#000', // Default color for buttons
  };

  const gradientButtonStyle = {
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    color: 'white',
    background: 'linear-gradient(to right, #6D00FF, #9F00FF)',
    cursor: loading ? 'not-allowed' : 'pointer', // Disable cursor if loading
  };


  // Handle input change to ensure only numbers are allowed
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and control characters (like backspace)
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleAmountChangeBalance = (e) => {
    const value = e.target.value;
    // Allow only numbers and control characters (like backspace)
    if (/^\d*\.?\d*$/.test(value)) {
      setAmountBalance(value);
    }
  };

  const handleAccountChange = async (e) => {
    const value = e.target.value;
    // Allow only numbers and control characters (like backspace)
    if (/^\d*\.?\d*$/.test(value)) {
      setAcctNumber(value);
    }

    
    // Find the selected bank code
    const selectedBankObject = bankList.find(
      (bank) => bank.name === selectedBank
    );
    
    if (!selectedBankObject) {
      console.error('Selected bank not found in the bank list');
      return;
    }
    
     const newBankCode = selectedBankObject.code;

    // Fetch account details and update recipientName
    if (value.length >= 10) {
      try {
        const paystackKey = 'sk_live_e20784823c0d42753c00d76109b3ddf986f33291';
        const verifyAccountResponse = await axios.get(
          `https://api.paystack.co/bank/resolve?account_number=${value}&bank_code=${newBankCode}`,
          {
            headers: {
              Authorization: `Bearer ${paystackKey}`,
            },
          }
        );

        if (verifyAccountResponse.data.status) {
          setRecipientName(verifyAccountResponse.data.data.account_name);
          setAccountNameClass('');
        } else {
          setRecipientName('');
        }
      } catch (error) {
        console.error('Error verifying account:', error);
        setRecipientName('');
      }
    } else {
      setRecipientName('');
    }
  };

  // for wallet balance
  const handleAccountChangeBalance = async (e) => {
    const value = e.target.value;
    // Allow only numbers and control characters (like backspace)
    if (/^\d*\.?\d*$/.test(value)) {
      setAcctNumberBalance(value);
    }

    
    // Find the selected bank code
    const selectedBankObject = bankList.find(
      (bank) => bank.name === selectedBankBalance
    );
    
    if (!selectedBankObject) {
      console.error('Selected bank not found in the bank list');
      return;
    }
    
     const newBankCode = selectedBankObject.code;

    // Fetch account details and update recipientName
    if (value.length >= 10) {
      try {
        const paystackKey = 'sk_live_e20784823c0d42753c00d76109b3ddf986f33291';
        const verifyAccountResponse = await axios.get(
          `https://api.paystack.co/bank/resolve?account_number=${value}&bank_code=${newBankCode}`,
          {
            headers: {
              Authorization: `Bearer ${paystackKey}`,
            },
          }
        );

        if (verifyAccountResponse.data.status) {
          setRecipientNameBalance(verifyAccountResponse.data.data.account_name);
          setAccountNameClassBalance('');
        } else {
          setRecipientNameBalance('');
        }
      } catch (error) {
        console.error('Error verifying account:', error);
        setRecipientNameBalance('');
      }
    } else {
      setRecipientNameBalance('');
    }
  };

  return (
    <div style={scrollContainer} className='pTop-80'>
      <ToastContainer />
      {/* Main Content Area */}
      <div className='text-warning auto-adjust'>Note: All withdrawals are automatically set to be made in your local currency due to guidelines.</div>
      <div className="main-content">
        <Container>
          <h1>Withdraw Points</h1>
            {/* Conditionally render the first input field */}
              <div style={{ marginBottom: '10px' }}>
                <input
                  type="text"
                  className={accountNameClass}
                  value={recipientName}
                  placeholder="Account Name"
                  style={{ ...inputStyle, fontWeight: 'bold', color: 'white' }}
                  readOnly
                />
              </div>
            
            <div style={{ marginBottom: '10px' }}>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className='form-control mt-4'
                style={{ ...inputStyle, fontWeight: 'bold', background: '#3F4254', color: 'white' }}
              >
                <option value="" disabled>
                  Select a Bank
                </option>
                {bankList.map((bank) => (
                  <option key={bank.id} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '10px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Account Number"
                value={acct_number}
                maxLength={10} // Set maximum number of characters
                onChange={handleAccountChange}
                style={{ ...inputStyle, fontWeight: 'bold', color: 'white', paddingRight: '150px' }}
              />

            </div>
            
            <div style={{ marginBottom: '10px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Amount"
                value={amount}
                maxLength={5} // Set maximum number of characters
                onChange={handleAmountChange}
                style={{ ...inputStyle, fontWeight: 'bold', color: 'white', paddingRight: '150px', paddingLeft: '20px' }}
              />
              
              <button
                type="button"
                onClick={handleMaxClick}
                style={{ ...buttonStyle, position: 'absolute', right: '10px', top: '15%', transform: 'translateY(-50%)' }}
              >
                Max
              </button>
              <span
                style={{ position: 'absolute', right: '10px', top: '150%', transform: 'translateY(-50%)', color: 'white', fontWeight: 'bold' }}
              >
                {convertedAmount ? `₦${convertedAmount}` : ''}
              </span>
            </div>
            
            <button
              className='mt-4'
              type="submit"
              style={gradientButtonStyle}
              onClick={handleWithdrawal}
              disabled={loading} // Disable the button when loading is true
            >
              {loading ? (
                <FontAwesomeIcon icon={faSpinner} spin /> // Show spinner when loading
              ) : (
                'Withdraw'
              )}
            </button>
        </Container>
      </div>

      {/* Second Withdrawal Box */}
      <div className="main-content mt-5" >
      <div className='text-warning mb-3'>{userData && !userData.isUserActive ? (
        <span>Activate a minting plan to be able to withdraw</span>
      ):
      (
        <span>Tokens must be held for the minimum minting period of 2 months before listing to be able to withdraw</span>
      )}</div>
      <div className='fw-bold mb-4'>Rate: 1000 MP Tokens = ₦1,800 (local currency)</div>
  <Container style={{ opacity: 0.5, pointerEvents: 'none' }}>
    <h1>Withdraw Balance</h1>
    {/* Conditionally render the first input field */}
    <div style={{ marginBottom: '10px' }}>
      <input
        type="text"
        className={accountNameClassBalance}
        value={recipientNameBalance}
        placeholder="Account Name"
        style={{ ...inputStyle, fontWeight: 'bold', color: 'white' }}
        readOnly
      />
    </div>

    <div style={{ marginBottom: '10px' }}>
      <select
        value={selectedBankBalance}
        onChange={(e) => setSelectedBankBalance(e.target.value)}
        className='form-control mt-4'
        style={{ ...inputStyle, fontWeight: 'bold', background: '#3F4254', color: 'white' }}
      >
        <option value="" disabled>
          Select a Bank
        </option>
        {bankList.map((bank) => (
          <option key={bank.id} value={bank.name}>
            {bank.name}
          </option>
        ))}
      </select>
    </div>

    <div style={{ marginBottom: '10px', position: 'relative' }}>
      <input
        type="text"
        placeholder="Account Number"
        value={acct_numberBalance}
        maxLength={10} // Set maximum number of characters
        onChange={handleAccountChangeBalance}
        style={{ ...inputStyle, fontWeight: 'bold', color: 'white', paddingRight: '150px' }}
      />
    </div>

    <div style={{ marginBottom: '10px', position: 'relative' }}>
      <input
        type="text"
        placeholder="Amount"
        value={amountBalance}
        maxLength={5} // Set maximum number of characters
        onChange={handleAmountChangeBalance}
        style={{ ...inputStyle, fontWeight: 'bold', color: 'white', paddingRight: '150px', paddingLeft: '20px' }}
      />

      <button
        type="button"
        onClick={handleMaxClickBalance}
        style={{ ...buttonStyle, position: 'absolute', right: '10px', top: '15%', transform: 'translateY(-50%)' }}
      >
        Max
      </button>
      <span
        style={{ position: 'absolute', right: '10px', top: '150%', transform: 'translateY(-50%)', color: 'white', fontWeight: 'bold' }}
      >
        {convertedTokens ? `₦${convertedTokens}` : ''}
      </span>
    </div>

    <button
      className='mt-4'
      type="submit"
      style={{ ...gradientButtonStyle, filter: 'grayscale(100%)' }} // Grayscale for an inactive look
    >
      Withdraw
    </button>
  </Container>
</div>

    </div>
  );
}

export default Withdraw;
