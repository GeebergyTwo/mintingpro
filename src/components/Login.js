// import useRef and useContext
import { useRef, useContext, useEffect, useState } from "react";
// import Context to get shared data from React context.
import Context from "../Context";
// import firebase authentication and real time database.
import { auth, db, realTimeDb } from "../firebase";
import {signInWithEmailAndPassword} from 'firebase/auth';
import {ref, onValue, orderByChild, equalTo, query, orderByValue, child} from 'firebase/database';
// import validator to validate user's credentials.
import validator from "validator";
// import custom componnets.
import withModal from "./Modal";
import SignUp from "./SignUp";
// import history
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from './Loading';

function Login(props) {
  // get shared data from context.
  const [isLoading, setIsLoading] = useState(false);
  // get toggle modal function from withModal - higher order component.
  const { toggleModal } = props;
  // create ref to get user's email and user's password.
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState('');


  const history = useNavigate();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  /**
   * validate user's credentials.
   * @param {*} email 
   * @param {*} password 
   * @returns 
   */
  const isUserCredentialsValid = (email, password) => {
    return validator.isEmail(email) && password;
  };

  /**
   * login
   */
  const login = () => {
    // show loading indicator.
    setIsLoading(true);
    // get the user's creadentials.
    const cleanedEmail = emailRef.current.value;
    const email = cleanedEmail.trim();
    const cleanedPassword = passwordRef.current.value;
    const password = cleanedPassword.trim();
    if (isUserCredentialsValid(email, password)) {
      // if the user's credentials are valid, call Firebase authentication service.
      signInWithEmailAndPassword(auth, email, password).then((userCredential) => {


        const userEmail = userCredential.user.email;
        const userID = userCredential.user.uid;
        const dbRef = ref(realTimeDb, `users/${userID}`);
        const ID = auth.currentUser.uid;
                localStorage.setItem('auth', JSON.stringify(ID));
                // save authenticated user to context.
                // hide loading.
                setIsLoading(false);
                // redirect to home page.
              
                // Check if 'new' key exists in localStorage
                if (localStorage.getItem('new') === 'true') {
                  // If it's a new user, redirect to a certain page
                  history('/');
                } else {
                  // If it's not a new user, redirect to another page
                  history('/');
                }
            
      

          // end of then promise
        })
        .catch((error) => {      
          // hide loading indicator.
          setIsLoading(false);
          if(isOnline){
          setIsLoading(false);
          toast.warning(`Your username or password is not correct`, {
            position: toast.POSITION.TOP_CENTER,
          });
          }
          else{
            toast.error(`Check your internet connection`, {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        });
    } else {
      // hide loading indicator.
      setIsLoading(false);
      if(isOnline){
      setIsLoading(false);
      toast.warning(`Your username or password is not correct`, {
        position: toast.POSITION.TOP_CENTER,
      });
      }
      else{
        toast.error(`Check your internet connection`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  return (
  // main login
  <div className="signup">
    <ToastContainer />
      <div className="signup__content">
        <div className="signup__container">
          <div className="signup__title">Login</div>
        </div>
        <div className="signup__subtitle"></div>
        <div className="signup__form">
          <input
            type="text"
            placeholder="Email"
            ref={emailRef}
          />
          <div className='d-flex' style={{ position: 'relative' }}>
          <input
            id="password"
            // type="password"
            placeholder="Password"
            ref={passwordRef} 
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
          {checkPassword && (
            <button className='p-btn' onClick={()=> setShowPassword(!showPassword)}>{showPassword ? (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486z"/>
              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
              <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708"/>
            </svg>
            </>
          ) : (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
              <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
              <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
            </svg>
            </>
          )}</button>
          )}
          
          </div>
          <button type="submit" className="signup__btn"  onClick={login}>
            Login
          </button>
          <span className="login__signup" onClick={() => toggleModal(true)}>Create Account</span>
        </div>
      </div>
     
      <footer class="mt-0 container-fluid fw-bold">
        <div class="row">
          {/*  */}
          <div class="col-md-3">
            <p>
              
              <ul>
              <h3 className='fw-bold text-theme'>About Us</h3>
                <li>From exceptional customer service, to excellent trading conditions, we make sure that our Clients are always our top priority. As a company, we aspire to continue to improve our services, ensuring that we always maintain ourselves to the highest spectrum of customer satisfaction.</li>
              </ul>
            </p>
          </div>
          {/*  */}
            <div class="col-md-3">   
               <p>
               <ul class="d-flex flex-straight justify-content-start text-start align-items-start">
                    <h3 className='fw-bold text-theme'>Get In Touch</h3>
                    <li className="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-envelope" viewBox="0 0 16 16">
                     <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                    </svg>
                      <span>nexusfxinvestmentblog@gmail.com</span></li>
                </ul>
               </p>
            </div>
            {/*  */}
            <div class="col-md-3">
                <p>
                <ul class="d-flex flex-straight justify-content-start text-start align-items-start">
                    <h3 className='fw-bold text-theme'>Customer Service</h3>
                    <li className="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mx-1 bi bi-whatsapp" viewBox="0 0 16 16">
                      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                      <span>+44 7425 854141</span></li>
                </ul>
                </p>
            </div>
            {/*  */}
            <div class="col-md-3">
              <p>
                
                <ul>
                <h3 className='fw-bold text-theme'>Address</h3>
                <li>Nexus Park, Avenue East, Skyline 120, Great Notley, Braintree, Essex, CM77 7AL, England.</li>
                </ul>
              </p>
            </div>
            {/*  */}
        </div>
        <div class="text-center mt-5 mb-1">
            <p>&copy; 2021 Nexus.fx.investment blog</p>
        </div>
      </footer>
      {isLoading && <Loading />}
    </div>
  );
}

export default withModal(SignUp)(Login);