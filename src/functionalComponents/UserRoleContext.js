import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve userId from localStorage when the component mounts
    const storedUserId = localStorage.getItem('auth');
    if (storedUserId) {
      setUserId(JSON.parse(storedUserId));
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3003/api/getUserData/${userId}`);
          setUserData(response.data);
        } catch (error) {
          console.error('Error retrieving user:', error);
          // Alert.alert('Error', 'Failed to retrieve user');
        }
      }
    };

    fetchUserData();
  }, [userId]); // Runs whenever userId changes

  const handleGetUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3003/api/getUserData/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error retrieving user:', error);
      // Alert.alert('Error', 'Failed to retrieve user');
    }
  };

  const updateUser = (newUserData) => {
    setUserData(newUserData);
  };

  return (
    <UserContext.Provider value={{ userData, updateUser, handleGetUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
