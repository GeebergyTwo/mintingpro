// countryAPI.js

import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1/all';

const fetchCountries = async () => {
  try {
    const response = await axios.get(BASE_URL);
    const countries = response.data.map((country) => ({
      value: country.name.common,
      label: country.name.common,
    }));
    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export default fetchCountries;
