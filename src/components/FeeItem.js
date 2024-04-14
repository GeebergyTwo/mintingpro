import React from 'react';
import UseCurrencyConverter from './useCurrencyConverter';
import { useFirebase } from './UserRoleContext';

const FeeItem = ({ amountInUSD }) => {
    const { userImg, userEmail, userFullName, userID, userPhoneNo ,userRole, userBalance, slots, setUserBalance, accountLimit, setAccountLimit, referralsBalance, setReferralsBalance, dailyDropBalance, setDailyDropBalance, isUserActive, setIsUserActive, referralsCount, setReferralsCount, totalReferrals, setTotalReferrals, referralCode, setReferralCode, hasPaid, referredUsers, setReferredUsers, adRevenue, setAdRevenue, deposit, setDeposit, currencySymbol, country} = useFirebase();
  const localCurrencyAmount = UseCurrencyConverter(amountInUSD, currencySymbol);
  const formattedBalance  = (Number(localCurrencyAmount) + 0.0).toFixed(2);

  return (
    <div>
      <span>{formattedBalance}</span>
    </div>
  );
};

export default FeeItem;
