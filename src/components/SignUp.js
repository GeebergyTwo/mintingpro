// import useRef, useContext
import { useRef, useContext, useEffect, useState } from "react";
// import Context to get shared data.
import Context from "../Context";
// import validator to validate user's information.
import validator from "validator";
// import firebase authentication.
import { auth, realTimeDb, db } from "../firebase";
import {getAuth,createUserWithEmailAndPassword} from 'firebase/auth'
import { ref, set} from 'firebase/database'
// import uuid to generate id for users.
import { v4 as uuidv4 } from "uuid";
import { getFirestore, getDoc, setDoc, doc, updateDoc, collection, query, where, getDocs, increment } from 'firebase/firestore';
import { ToastContainer, toast } from "react-toastify";
import { getStorage, ref as Ref, getDownloadURL, listAll } from "firebase/storage";
import "react-toastify/dist/ReactToastify.css";
import {useLocation} from 'react-router-dom';

function SignUp(props) {
  // get toggleModal functin from higher order components.
  const { toggleModal } = props;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkPassword, setCheckPassword] = useState('');
  const [refParam, setRefParam] = useState('');

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

  const location = useLocation();

  // Extract referral code from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const referralCode = params.get('ref');
    
    // Associate referral code with the sign-up process
    // This could involve storing the referral code in state or passing it to an API call
    setRefParam(referralCode);
  }, [location.search]);

  // create refs to get user's email, user's password, user's confirm password.
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const roleRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const referralRef = useRef(null);

  const { cometChat, setIsLoading } = useContext(Context);

  const Naira = 'naira';
  const Crypto = 'crypto';

  /**
   * generate random avatar for demo purpose
   * @returns 
   */
  useEffect(() => {
    const fetchAvatars = async () => {
      const storage = getStorage();
      const avatarsRef = Ref(storage, 'avatars');

      try {
        const result = await listAll(avatarsRef);
        const downloadURLs = await Promise.all(
          result.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return url;
          })
        );

        setAvatars(downloadURLs);

        if (downloadURLs.length > 0) {
          // Select a random avatar from the list
          const randomIndex = Math.floor(Math.random() * downloadURLs.length);
          setSelectedAvatar(downloadURLs[randomIndex]);
        }
      } catch (error) {
        console.error('Error fetching avatars:', error);
      }
    };

    fetchAvatars();
  }, []); // Run once when the component mounts


  /**
   * validate user's informatin.
   * @param {*} param0 
   * @returns 
   */
  const isSignupValid = ({ fullName, email, phone, role, password, confirmPassword }) => {
    if (validator.isEmpty(fullName)){
      // alert("Please input your full name");
      toast.warning("Please input your full name", {
        position: toast.POSITION.TOP_CENTER,
      });
      return false
    }
    if (!validator.isEmail(email)) {
      // alert("Please input your email");
      toast.warning("Please input a valid email", {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
    if (!validator.isMobilePhone(phone)) {
      // alert("Please input a valid phone number");
      toast.warning("Please input a valid phone number", {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
    if (validator.isEmpty(role)) {
      // alert("Please select field");
      toast.warning("Please select field", {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
    if (validator.isEmpty(password) || !validator.isLength(password, {min: 6})) {
      // alert("Please input your password. You password must have at least 6 characters");
      toast.warning("Please input your password. Your password must have at least 6 characters", {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
    if (validator.isEmpty(confirmPassword)) {
      // alert("Please input your confirm password");
      toast.warning("Please input your confirm password", {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
    if (password !== confirmPassword) {
      // alert("Confirm password and password must be the same");
      toast.warning("Confirm password and password must be the same", {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
    return true;
  };

  /**
   * sign up
   */
  const signup = () => {
    // get user's email, user's password, user's confirm password.
    const fullName = fullNameRef.current.value;
    const cleanedEmail = emailRef.current.value;
    const email = cleanedEmail.trim();
    const phone = phoneRef.current.value;
    const role = roleRef.current.value;
    const cleanedPassword = passwordRef.current.value;
    const password = cleanedPassword.trim();
    const cleanedConfirmPassword = confirmPasswordRef.current.value;
    const confirmPassword = cleanedConfirmPassword.trim();
    const referralCode =  referralRef.current.value;

    if (isSignupValid({fullName, email, phone, role, password, confirmPassword })) {
      // show loading 
      setIsLoading(true);
      // create new user's uuid.
      
      // generate user's avatar.
      const userAvatar = selectedAvatar;

 // Send the referral code to the server for registration.
// Call Firebase to register a new account.
    if (referralCode.trim() !== '') {
      const processReferralSignUp = async () =>{
      // Query to find the user with the matching referral code

      // start try
      const userReferral = referralCode;
      const doesReferralExist = async () => {
      await fetch(`https://dripdash.onrender.com/api/checkUserReferral/${userReferral}`)
       .then(response => {
         if (!response.ok) {
           throw new Error(`HTTP error! Status: ${response.status}`);
         }
         // setUsers(response)
         // console.log(response);
         return response.json();
       })
       .then(data => {
        const referredById = data.status;
         if(referredById !== 'false'){
              // Listen to changes in the user role
              
          createUserWithEmailAndPassword(auth, email, password)
          .then((userCredentials) => {
            if (userCredentials) {
              const userID = userCredentials.user.uid;
              const user = userCredentials.user;
              const userReferralCode = uuidv4(); 
              const referrer = data;
              const referrerID = referrer.referrerInfo.userId;

              // payLoad data
              const userId = prev => prev + 1;
              const payLoad = {
                avatar: userAvatar,
                email,
                name: fullName,
                userId: userID,
                number: phone,
                role,
                accountLimit : 0,
                balance: 0,
                deposit: 0,
                referralsBalance : 0,
                dailyDropBalance : 0,
                isUserActive: false,
                referralsCount : 0,
                totalReferrals: 0,
                referralCode: userReferralCode,
                referredBy: referrerID,
                hasPaid: false,
                taskCounter: 0,
                referralRedeemed: false,
                referredUsers: 0,
                adRevenue: 0,
              }

              const createUser = async () => {
                  await fetch(`https://dripdash.onrender.com/api/createUser`,
                 {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    // Add any other headers as needed
                  },
                  body: JSON.stringify(payLoad),
                })
                  .then(response => {
                    if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then(data => {
                    localStorage.setItem('new', true);
                    toast.success(`${userCredentials.user.email} was created successfully! Please sign in with your created account`, {
                      position: toast.POSITION.TOP_CENTER,
                    });
                    setIsLoading(false);
                    // Close sign-up dialog.
                    toggleModal(false);
                  })
                  .catch(error => {
                    console.error('Error:', error.message);
                  });
                 
              }

      
              createUser();

              const updateReferrerData = async () => {
                if (user) {
                  const userDetails = {
                    userId: referrerID,
                  };
              
                  try {
                    const response = await fetch("https://dripdash.onrender.com/api/updateInfo", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        // Add any other headers as needed
                      },
                      body: JSON.stringify(userDetails),
                    });
              
                    if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                    }
              
                    const data = await response.json();
                  } catch (error) {
                    console.error("Error:", error.message);
                  }
                }
              };
              
              updateReferrerData();

            
              
              
              
            }
                
              
      
    
          })
          .catch((error) => {
            if(isOnline){
              console.log(error);
            setIsLoading(false);
            toast.error(`Cannot create your account, ${email} already exists, please try again!`, {
              position: toast.POSITION.TOP_CENTER,
            });
            }
            else{
              setIsLoading(false);
              toast.error(`Check your internet connection`, {
                position: toast.POSITION.TOP_CENTER,
              });
            }
            
          });
         }
         else{

          setIsLoading(false);
          toast.error(`Invalid Referral Code`, {
            position: toast.POSITION.TOP_CENTER,
          });
         }
       })
       .catch(error => {
          setIsLoading(false);
         console.error('this is a catch exists:', error.message);
       });
   }
    doesReferralExist();

      // end try
      
      
      }
  
      processReferralSignUp();
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        if (userCredentials) {
          const userID = userCredentials.user.uid;
          const user = userCredentials.user;
          const userReferralCode = uuidv4(); 
          
          const createUser = async () => {
            if(user){
              const payLoad = {
                avatar: userAvatar,
                email,
                name: fullName,
                userId: userID,
                number: phone,
                role,
                accountLimit : 0,
                balance: 0,
                deposit: 0,
                referralsBalance : 0,
                dailyDropBalance : 0,
                isUserActive: false,
                referralsCount : 0,
                totalReferrals: 0,
                referralCode: userReferralCode,
                referredBy: 'none',
                hasPaid: false,
                referralRedeemed: false,
                referredUsers: 0,
                adRevenue: 0,
              }
              await fetch(`https://dripdash.onrender.com/api/createUser`,
             {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // Add any other headers as needed
              },
              body: JSON.stringify(payLoad),
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
              .then(data => {
                localStorage.setItem('new', true);
                toast.success(`${userCredentials.user.email} was created successfully! Please sign in with your created account`, {
                  position: toast.POSITION.TOP_CENTER,
                });
                setIsLoading(false);
                // Close sign-up dialog.
                toggleModal(false);
              })
              .catch(error => {
                console.error('Error:', error.message);
              });
            }
             
          }

  
          createUser();
          
        }
      })
      .catch((error) => {
        if(isOnline){
          console.log(error);
        setIsLoading(false);
        toast.error(`Cannot create your account, ${email} already exists, please try again!`, {
          position: toast.POSITION.TOP_CENTER,
        });
        }
        else{
          toast.error(`Check your internet connection`, {
            position: toast.POSITION.TOP_CENTER,
          });
        }
        
      });
        
    
    }


      // 
    }
  };

  return (
    
    <div className="signup">
      <ToastContainer />
      <div className="signup__content">
        <div className="signup__container">
          <div className="signup__title text-theme">Sign Up</div>
          <div className="signup__close">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" alt="close"
          onClick={() => toggleModal(false)} height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
           <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
          </svg>
          </div>
        </div>
        <div className="signup__subtitle"></div>
        <div className="signup__form">
        <input type="text" placeholder="Username" ref={fullNameRef} />
          <input type="text" placeholder="Email" ref={emailRef} />
          <input type="text" placeholder="Phone" ref={phoneRef} />
          <select ref={roleRef} defaultValue={Naira} >
            <option value={Naira}>Earn In Naira</option>
            <option value={Crypto}>Earn In Bitcoin (crypto)</option>
          </select>
          <input type="text" defaultValue={refParam || ''} placeholder="Referral code (optional)" ref={referralRef} />
          <div className='d-flex' style={{ position: 'relative' }}>
          <input
            id="password"
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
            {/* confirm password field */}

            <div className='d-flex' style={{ position: 'relative' }}>
          <input
            id="password"
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
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
          <button className="signup__btn" onClick={signup}>
            
            Sign Up
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default SignUp;