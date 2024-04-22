import React, { createContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {auth} from '../firebase';
import { useFirebase } from './UserRoleContext';

const ToastContext = createContext();

const user = auth.currentUser;
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastProvider = ({ children }) => {
  const { userImg, userEmail, userID, userRole } = useFirebase(); // Fetch Firebase data here or pass it as props

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data;
        startToastNotifications(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();

  }, []); // Make sure to pass dependencies if needed

  const startToastNotifications = (countries) => {
    // Start interval to show toast every 5 seconds
    const interval = setInterval(() => {
      // Generate random cash-out amount
      const randomNumber = Math.floor(Math.random() * (15000 - 2000 + 1)) + 2000;
      // Select random country
      const randomIndex = Math.floor(Math.random() * countries.length);
      const randomCountry = countries[randomIndex].name.common;

      // Show toast notification
     
        toast.success(`Somebody just cashed out $${randomNumber} from ${randomCountry}`, {
            position: toast.POSITION.BOTTOM_RIGHT,
            toastStyle: { width: '50% !important' },
            toastId: 'toast-display-success',
          });
      
    }, 20000);

    // Cleanup function to stop the interval when component unmounts
    return () => clearInterval(interval);
  };

  return (
    <ToastContext.Provider value={{}}>
      <ToastContainer
        position="bottom-right" // Set position to bottom right
        autoClose={5000} // Auto close after 5 seconds
        closeOnClick // Close on click
        pauseOnHover // Pause on hover
      />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
