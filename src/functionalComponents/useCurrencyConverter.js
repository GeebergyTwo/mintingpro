import { useState, useEffect } from 'react';
import axios from 'axios';

const useCurrencyConverter = (amountInNGN) => {
  const [usdAmount, setUsdAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/NGN');
        const rates = response.data.rates;
        const usdRate = rates['USD']; // Extract USD rate

        // Convert the amount to USD
        const convertedAmount = amountInNGN * usdRate;
        setUsdAmount(convertedAmount);
      } catch (error) {
        console.error('Error fetching exchange rate:', error);
        setError('Error fetching exchange rate');
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRate();
  }, [amountInNGN]);

  return { usdAmount, loading, error };
};

export default useCurrencyConverter;
