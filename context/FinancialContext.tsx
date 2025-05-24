import React, { createContext, useContext, useState, useEffect } from 'react';

type FinancialContextType = {
  totalSharesValue: number;
  totalMonthlyRent: number;
  totalWithdrawals: number;
  updateFinancials: (shares: any[]) => void;
  updateWithdrawals: (withdrawals: any[]) => void; // New function
};

type Share = {
  shares: number;
  sharePrice: number;
  monthlyRent: number;
  totalShares: number;
};

type Withdrawal = {
  status: string;
  amount: number;
};

const FinancialContext = createContext<FinancialContextType>({
  totalSharesValue: 0,
  totalMonthlyRent: 0,
  totalWithdrawals: 0,
  updateFinancials: (shares: Share[]) => {},
  updateWithdrawals: (withdrawals: Withdrawal[]) => {}, // Added
});

export const FinancialProvider = ({ children }: { children: React.ReactNode }) => {
  const [totalSharesValue, setTotalSharesValue] = useState(0);
  const [totalMonthlyRent, setTotalMonthlyRent] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

  useEffect(() => {
    const pendingTotal = withdrawals
      .filter(w => w.status === 'pending')
      .reduce((sum, w) => sum + w.amount, 0);
    setTotalWithdrawals(pendingTotal);
  }, [withdrawals]);

  const updateFinancials = (shares: Share[]) => {
    const sharesValue = shares.reduce((acc, share) => 
      acc + (share.shares * (share.sharePrice || 0)), 0);
    const monthlyRent = shares.reduce((acc, share) => 
      acc + (share.monthlyRent * (share.shares / share.totalShares)), 0);
    
    setTotalSharesValue(sharesValue);
    setTotalMonthlyRent(monthlyRent);
  };

  const updateWithdrawals = (newWithdrawals: Withdrawal[]) => {
    setWithdrawals(newWithdrawals);
  };

  return (
    <FinancialContext.Provider value={{ 
      totalSharesValue, 
      totalMonthlyRent, 
      totalWithdrawals, 
      updateFinancials,
      updateWithdrawals
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancials = () => useContext(FinancialContext);