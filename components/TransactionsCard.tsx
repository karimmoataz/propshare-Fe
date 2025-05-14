import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import clsx from 'clsx';
import I18n from "../lib/i18n";
import { useLanguage } from '../context/LanguageContext';

type TransactionItemProps = {
  type: 'Receive' | 'Deposit' | 'Withdraw';
  amount: number;
  time: string;
  source?: string;
};

const TransactionCard: React.FC<TransactionItemProps> = ({ type, amount, time, source }) => {
  const { isRTL } = useLanguage();
  const isIncome = type === 'Receive' || type === 'Deposit';

  // Get translated type title
  const getTranslatedType = () => {
    switch (type) {
      case 'Receive':
        return I18n.t('transactions.receive');
      case 'Deposit':
        return I18n.t('transactions.deposit');
      case 'Withdraw':
        return I18n.t('transactions.withdraw');
      default:
        return type;
    }
  };

  return (
    <View className="flex-row items-center p-4">
      <MaterialCommunityIcons
        name={isIncome ? 'arrow-down-circle' : 'arrow-up-circle'}
        size={24}
        color={isIncome ? '#4CAF50' : '#F44336'}
      />
      <View className="flex-1 ms-3">
        <Text className="text-lg font-bold">{getTranslatedType()}</Text>
        {source && <Text className="text-gray-500 text-sm">{source}</Text>}
      </View>
      <View className='items-end'>
        <Text
            className={clsx('text-lg font-bold', isIncome ? 'text-green-500' : 'text-red-500')}
        >
            {I18n.t('currency.code')} {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Text>
        <Text className="text-gray-400 text-sm">{time}</Text>
      </View>
    </View>
  );
};

export default TransactionCard;