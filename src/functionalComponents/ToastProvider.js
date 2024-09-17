import React, { createContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {auth} from '../firebase';
import { stringify } from 'querystring-es3';
import firstNamesJson from './first-names.json';

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

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        // Fetch names data from an API or use a predefined list
        const nameResponse = firstNamesJson;
        // clean up the name json
        // Step 1: Remove square brackets
        const cleanedString = nameResponse.slice(1, -1);

        // Step 3: Trim each name and remove double quotes
        const trimmedNames = cleanedString.map(name => name.trim().replace(/"/g, ''));
        // 
        const names = trimmedNames;
        const countries = response.data;
        startToastNotifications(names, countries);
      } catch (error) {
        console.error('Error fetching countries or names:', error);
      }
    };



    fetchCountries();

  }, []); // Make sure to pass dependencies if needed

  const startToastNotifications = (names, countries) => {
    // Start interval to show toast every 5 seconds
    const interval = setInterval(() => {
      // Generate random cash-out amount
      const randomNumber = Math.floor(Math.random() * (25000 - 2000 + 1)) + 2000;
      // Select randon names
      const randomNameIndex = Math.floor(Math.random() * names.length);
      const randomName = names[randomNameIndex];
      // Select random country
      const randomIndex = Math.floor(Math.random() * countries.length);
      const randomCountry = countries[randomIndex].name.common;

      // Show toast notification
     
        toast.success(`${randomName} just cashed out $${randomNumber} from ${randomCountry}`, {
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
