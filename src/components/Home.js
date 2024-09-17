import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faUser, faSpinner  } from '@fortawesome/free-solid-svg-icons';
import { storage } from '../firebase';
import { uploadBytesResumable, ref as databaseRef, getDownloadURL } from 'firebase/storage';
import { Container } from 'react-bootstrap';
import { useUser } from '../functionalComponents/UserRoleContext';
import useCurrencyConverter from '../functionalComponents/useCurrencyConverter';

function Home() {
  const { userData, handleGetUser } = useUser();
  const balance = userData?.balance || 0; // balance in naira
  const balanceInTokens = balance / 1.8; // balance in tokens for user display ONLY
  const { usdAmount: balanceInUSD, loading: balanceLoading, error: balanceError } = useCurrencyConverter(balance);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = userData?._id || '';

  const storedUserId = localStorage.getItem('auth');

  // Fetch user data on component mount
  useEffect(() => {
    if (!userData) {
      handleGetUser(storedUserId).then(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [userData, handleGetUser, storedUserId]);

  // Helper function to format numbers as currency
  const formatCurrency = (number, decimals = 2) => {
    return Number(number.toFixed(decimals)).toLocaleString();
  };

    // Fetch all tasks and user's completed tasks
    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await axios.get(`http://localhost:3003/api/allTasks/${userId}`);
          setTasks(response.data.tasks); // All tasks from the Task collection
          setCompletedTasks(response.data.completedTasks); // IDs of tasks the user has completed
          setLoading(false);
        } catch (err) {
          setError('No Tasks available');
          setLoading(false);
        }
      };
  
      fetchTasks();
    }, [userId]);

    useEffect(() => {
      const fetchPendingTasks = async () => {
        try {
          const response = await axios.get(`http://localhost:3003/api/pendingTasks/${userId}`);
          setPendingTasks(response.data.pendingTasks);
        } catch (error) {
          console.error('Error fetching pending tasks:', error);
        }
      };
  
      fetchPendingTasks();
    }, [userId]);
  
    // Function to mark a task as completed
    const handleCompleteTask = async (taskId) => {
      try {
        // Send a request to the backend to mark the task as completed
        await axios.post(`http://localhost:3003/api/completTask/${userId}`, { taskId });
  
        // Update the local state to reflect the completed task
        setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, taskId]);
      } catch (err) {
        console.error('Error completing task', err);
      }
    };

    const baseMintRate = 0.05; // Mint rate at level 1
  const levelIncrement = 0.01; // Increment per level
  const maxLevel = 15;
  const maxMintRate = 0.19; // Mint rate at level 15
  
  const getUserLevel = (mintRate, isUserActive) => {
    if (!isUserActive || mintRate === 0) {
      return 'Inactive';
    }
  
    if (mintRate >= maxMintRate) {
      return maxLevel;
    }
  
    const level = Math.floor((mintRate - baseMintRate) / levelIncrement) + 1;
  
    return level < 1 ? 1 : level;
  };
  
  // Ensure mint_rate and isUserActive exist before calculating the user level
  const userLevel = userData && userData.mint_rate !== undefined && userData.isUserActive !== undefined 
    ? getUserLevel(userData.mint_rate, userData.isUserActive)
    : 'Unknown';
  
  console.log('User level:', userLevel);


  
  // add tasks for users
// Modify handleFileChange to accept taskId
const handleFileChange = (taskId, taskDescription, taskPoints) => async (event) => {
  setLoading(true);
  const userID = userId;
  const selectedFile = event.target.files[0];

  if (selectedFile) {
    const storageRef = databaseRef(storage, `images/${userID}/${Date.now()}_${taskId}.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, 
      (error) => {
        console.log(error);
        setLoading(false);
      }, 
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Save task proof to 'pendingTasks'
          const saveTaskProof = async () => {
            try {
              const response = await fetch('http://localhost:3003/api/addToPending', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userID,
                  imageSrc: downloadURL,
                  taskID: taskId,  // Pass task ID here
                  description: taskDescription,
                  points: taskPoints,
                }),
              });
              
              if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

              /* eslint-disable no-restricted-globals */
              setTimeout(() => {
                location.reload(true);
              }, 3000);
              /* eslint-enable no-restricted-globals */
            } catch (error) {
              console.error('Error adding task proof:', error.message);
            }
          };
          saveTaskProof();
        });
      }
    );
  } else {
    setLoading(false);
  }
};

  

  // Define styles
  const scrollContainer = {
    paddingBottom: '80px',
    paddingTop: '20px',
    minHeight: '100vh', // Ensures content takes at least the full height of the viewport
    boxSizing: 'border-box',
    background: 'linear-gradient(to bottom, #3c3f4c, #262A36)', // Gradient from dark purple to a lighter purple
  };

  const spaceBetween = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const big = {
    fontSize: '20px',
  };

  const bigBold = {
    fontSize: '30px',
    fontWeight: 'bold',
  };

  const txContent = {
    background: '#4A4D61',
    color: '#fff',
    width: '100%',
    padding: '14px',
    borderRadius: '4px',
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
  };

  const profilePicContainer = {
    height: '50px',
    width: '50px',
    padding: '10px',
    border: '2px solid #fff',
    borderRadius: '50%',
    overflow: 'hidden', // Ensures the image stays within the circle
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const profilePic = {
    height: '100%',
    width: '100%',
    objectFit: 'cover', // Ensures the image covers the circle and maintains aspect ratio
  };

  const levelContainerStyle = {
    backgroundColor: '#A366FF', // Lighter background color
    color: '#6D00FF', // Original color for the text
    padding: '10px 20px',
    borderRadius: '8px', // Slightly rounded borders
    display: 'inline-block', // Keep the element to the left
    fontWeight: 'bold',
  };

  const balanceRight = {
    textAlign: 'right', // Align the USD balance to the right
    fontSize: '16px',
    fontWeight: 'bold',
  };

  const uploadBtn = {
    border: 'none',
    borderRadius: '25px',
    padding: '10px 20px',
    color: 'white',
    background: '#FFF',
    color: '#000',
    cursor: 'pointer',
    fontWeight: 'bold',
    outline: 'none',
  }

  return (
    <div style={scrollContainer} className='pTop-80'>
      <div className="balance-content">
        <Container>
          <div className='d-flex align-items-end'>
            <div style={profilePicContainer} className='mt-4'>
              <FontAwesomeIcon icon={faUser} size="2x" style={profilePic} />
            </div>
            <h1 className='mx-2'>Welcome, {userData?.username || ''}!</h1>
          </div>
           {loading || !userData ? (
              <span>Loading...</span>
            ):
            (
              <div className="fw-bold mt-2" style={levelContainerStyle}>
                {userLevel === 'Inactive' ? 'Inactive' : `Level ${userLevel}`}
              </div>
            )}
          
          
          <div style={spaceBetween} className='mt-4'>
            <p style={big}>Tokens Balance: </p>
            <p style={bigBold}>{formatCurrency(balanceInTokens, 2)}</p>
          </div>

          {/* Balance in USD aligned to the right */}
          <div className='d-flex justify-content-between'>
            <div></div> {/* Empty div to push the USD balance to the right */}
            <div style={balanceRight}>
              {balanceLoading ? 'Loading...' : balanceError ? `Error: ${balanceError}` : `$${formatCurrency(balanceInUSD, 2)}`}
            </div>
          </div>
        </Container>
      </div>

      {/* FUND WALLET */}
      <div className="main-content mt-2">
        <Container>
          <h2>Mint Points</h2>
          <div style={spaceBetween}>
            <p style={big}>Referral & Task Points: </p>
            <p style={bigBold}>{userData?.mint_points || 0}</p>
          </div>
        </Container>
      </div>

      {/* SERVICES CONTENT */}
      <div className="main-content mt-5 mb-5">
        <Container>
        <h2>All Tasks</h2>
        {loading ? (
          <FontAwesomeIcon className="mt-3" icon={faSpinner} spin size="3x" />
        ) : tasks ? (
          <ul>
            {tasks.map(task => (
              <li key={task._id} style={txContent} className='flex-column flex-md-row'>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p className='text-warning fw-bold'>{task.points} Points</p>
                  {task.link && <a href={task.link} alt='task link'>{task.link} </a>}
                </div>
                <div>
                  {completedTasks.includes(task._id) ? (
                    <>
                      <button disabled style={uploadBtn}>Task Completed</button>
                      {/* File input for uploading proof */}
                      {/* <input type="file" onChange={handleFileChange(task._id, task.description, task.points)} disabled /> */}
                    </>
                  ) : pendingTasks.some(pendingTask => pendingTask.taskID === task._id) ? (
                    <>
                      <button disabled style={uploadBtn}>Task Pending</button>
                      {/* File input for uploading proof */}
                      {/* <input type="file" onChange={handleFileChange(task._id, task.description, task.points)} disabled /> */}
                    </>
                  ) :(
                    <>
                      {/* <button onClick={() => handleCompleteTask(task._id)}>Complete Task</button> */}
                      {/* Enable file input for uploading proof */}
                      <button style={uploadBtn} onClick={() => document.getElementById(`file-upload-${task._id}`).click()}>
                         Upload Screenshot
                       </button>
                       {/* Hidden file input element */}
                       <input
                        type="file"
                        id={`file-upload-${task._id}`}
                        style={{ display: 'none' }}
                        onChange={handleFileChange(task._id, task.description, task.points)}
                      />
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <div>Failed to fetch tasks</div>
        )}
      
        </Container>
      </div>
    </div>
  );
}

export default Home;
