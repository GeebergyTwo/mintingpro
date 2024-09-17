import { useState, useEffect } from "react";
import { Container } from 'react-bootstrap';
import validator from "validator";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [refParam, setRefParam] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referralCode = params.get('ref');
    setRefParam(referralCode || 'none');
  }, [location.search]);


  // Form validation
  const isSignupValid = () => {
    const { fullName, email, phone, password, confirmPassword } = formData;

    if (validator.isEmpty(fullName)) {
      toast.warning("Please input your username", { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    if (!validator.isEmail(email)) {
      toast.warning("Please input a valid email", { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    if (!validator.isMobilePhone(phone)) {
      toast.warning("Please input a valid phone number", { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    if (validator.isEmpty(password) || !validator.isLength(password, { min: 6 })) {
      toast.warning("Password must be at least 6 characters", { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match", { position: toast.POSITION.TOP_CENTER });
      return false;
    }
    return true;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sign-up function
  const signup = async () => {
    const { fullName, email, phone, password } = formData;

    if (!isSignupValid()) {
      return;
    }

    // Generate wallet address and referral code using uuid
    const walletAddress = uuidv4();
    const userReferralCode = `${fullName}-${uuidv4()}`;

    const userData = {
      username: fullName,
      email,
      phone_no: phone,
      password,
      walletAddress,
      userReferralCode,
      referralCode: refParam || 'none',
    };

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3003/api/addUser', userData);
      toast.success("User Account Created Successfully", { position: toast.POSITION.TOP_CENTER });
      setIsLoading(false);
      // Delay navigation for 3 seconds (3000 ms)
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      // Handle different error scenarios based on response status
      setIsLoading(false);

      if (error.response && error.response.data) {
        const { status, message } = error.response.data;

        if (status === "failed" && message === "Invalid referral code") {
          toast.error("Invalid referral code. Please try again.", { position: toast.POSITION.TOP_CENTER });
          setTimeout(() => {
            navigate('/signup');
          }, 2000);
        } else if (status === "failed" && message === "Username already exists") {
          toast.error("Username already exists. Please choose another username.", { position: toast.POSITION.TOP_CENTER });
        } else if (status === "failed" && message === "Email or phone number already exists"){
          toast.error("Email or phone number already exists.", { position: toast.POSITION.TOP_CENTER });
        }
        else {
          toast.error("Failed to sign up. Please try again.", { position: toast.POSITION.TOP_CENTER });
        }
      } else {
        toast.error("An error occurred. Please try again later.", { position: toast.POSITION.TOP_CENTER });
      }
    }
  };

  // Styles
  const scrollContainer = {
    paddingBottom: '80px',
    paddingTop: '20px',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #3c3f4c, #262A36)',
  };
  const inputStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '13px',
    backgroundColor: 'transparent',
    outline: 'none',
    width: '100%',
    color: 'white',
    fontWeight: 'bold',
  };
  const signContainer = {
    padding: '20px',
    color: '#fff',
    maxWidth: '400px',
    margin: 'auto',
    backgroundColor: '#3F4254',
    borderRadius: '6px',
  };
  const gradientButtonStyle = {
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    color: 'white',
    background: 'linear-gradient(to right, #6D00FF, #9F00FF)',
    cursor: 'pointer',
  };
  const decNone = {
    textDecoration: 'none',
  };

  return (
    <div style={scrollContainer} className="pTop-80">
      <ToastContainer />

      <Container>
        <div style={signContainer}>
          <div className="d-flex align-items-center justify-content-between p-2">
            <h3>Sign Up</h3>
            <p className="fw-bold">Minter<span style={{ color: '#6D00FF' }}>Pro</span></p>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Username"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ ...inputStyle, paddingRight: '40px' }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 15,
                top: 10,
                background: 'transparent',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div className='text-danger'>Please remember your password, as it cannot be recovered if lost.</div>

          <button onClick={signup} style={gradientButtonStyle} disabled={isLoading}>
            {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : 'Sign Up'}
          </button>

          <div className='d-flex text-end justify-content-end'>
            <Link to="/login" className="mt-3" style={decNone}>
                <span className="text-white">Already have an account?</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default SignUp;
