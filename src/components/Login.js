import { useState, useContext, useEffect } from "react";
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../functionalComponents/UserRoleContext';
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

function Login(props) {
  const { userData, handleGetUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState('');
  const history = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isUserCredentialsValid = (emailOrUsername, password) => {
    return emailOrUsername && password;
  };

  const login = async () => {
    setIsLoading(true);

    if (isUserCredentialsValid(emailOrUsername, password)) {
      try {
        const response = await axios.post("http://localhost:3003/api/login", {
          emailOrUsername,
          password,
        });

        const data = response.data;

        if (response.status === 200) {
          // Handle successful login
          localStorage.setItem('auth', JSON.stringify(data.userId));
          const storedUserId = localStorage.getItem('auth');
          handleGetUser(storedUserId);
          setTimeout(() => {
            history('/');
          }, 1500);
        } else {
          toast.error(data.message || "Invalid username or password", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message || "Invalid username or password", {
            position: toast.POSITION.TOP_CENTER,
          });
        } else {
          toast.error("An error occurred. Please try again.", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.warning("Please fill in both fields.", {
        position: toast.POSITION.TOP_CENTER,
      });
      setIsLoading(false);
    }
  };

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

  return (
    <div style={scrollContainer} className='pTop-80'>
      <ToastContainer />
      <Container>
        <div style={signContainer}>
          <div className="d-flex align-items-center justify-content-between p-2">
            <h3>Login</h3>
            <p className="fw-bold">Minter<span style={{color: '#6D00FF'}}>Pro</span></p>
          </div>
          <div>
            <div style={{ marginBottom: '10px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Email or Username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                style={{ ...inputStyle, fontWeight: 'bold', color: 'white', paddingRight: '150px' }}
              />
            </div>

            <div className='d-flex align-items-center' style={{ position: 'relative' }}>
              <div style={{ flex: 1, position: 'relative', marginBottom: '10px' }}>
                <input
                  id="password"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setCheckPassword(e.target.value);
                  }}
                  style={{
                    ...inputStyle,
                    fontWeight: 'bold',
                    color: 'white',
                    paddingRight: '40px',
                    width: '100%',
                  }}
                />
              </div>
              {checkPassword && (
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 15,
                    top: -5,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>

            <button type="submit" style={gradientButtonStyle} onClick={login}>
              {isLoading ? <FontAwesomeIcon icon={faSpinner} spin /> : ' Login '}
            </button>

            <div className="d-flex justify-content-end mb-2">
              <Link to="/signup" className="text-white">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Login;
