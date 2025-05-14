import React, { createContext, useContext, useState } from 'react';

type FinancialContextType = {
  totalSharesValue: number;
  totalMonthlyRent: number;
  updateFinancials: (shares: any[]) => void;
};

type Share = {
  shares: number;
  sharePrice: number;
  monthlyRent: number;
  totalShares: number;
};

const FinancialContext = createContext<FinancialContextType>({
  totalSharesValue: 0,
  totalMonthlyRent: 0,
  updateFinancials: (shares: Share[]) => void {},
});

export const FinancialProvider = ({ children }: { children: React.ReactNode }) => {
  const [totalSharesValue, setTotalSharesValue] = useState(0);
  const [totalMonthlyRent, setTotalMonthlyRent] = useState(0);

  const updateFinancials = (shares: Share[]) => {
    const sharesValue = shares.reduce((acc, share) => 
      acc + (share.shares * (share.sharePrice || 0)), 0);
    const monthlyRent = shares.reduce((acc, share) => 
      acc + (share.monthlyRent * (share.shares / share.totalShares)), 0);
    
    setTotalSharesValue(sharesValue);
    setTotalMonthlyRent(monthlyRent);
  };

  return (
    <FinancialContext.Provider value={{ totalSharesValue, totalMonthlyRent, updateFinancials }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancials = () => useContext(FinancialContext);