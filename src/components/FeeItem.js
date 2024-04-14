import React from 'react';
import UseCurrencyConverter from './useCurrencyConverter';
import { useFirebase } from './UserRoleContext';

const FeeItem = ({ amountInUSD }) => {
    const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, slots, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, currencySymbol, country} = useFirebase();
  const localCurrencyAmount = UseCurrencyConverter(amountInUSD, currencySymbol);

  return (
    <div>
      <p>Amount in USD: {amountInUSD}</p>
      <p>Amount in Local Currency: {localCurrencyAmount}</p>
    </div>
  );
};

export default FeeItem;
