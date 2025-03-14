import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import clsx from 'clsx';

type TransactionItemProps = {
  type: 'Receive' | 'Deposit' | 'Withdraw';
  amount: number;
  time: string;
  source?: string;
};

const TransactionCard: React.FC<TransactionItemProps> = ({ type, amount, time, source }) => {
  const isIncome = type === 'Receive' || type === 'Deposit';

  return (
    <View className="flex-row items-center p-4">
      <MaterialCommunityIcons
        name={isIncome ? 'arrow-down-circle' : 'arrow-up-circle'}
        size={24}
        color={isIncome ? '#4CAF50' : '#F44336'}
      />
      <View className="flex-1 ml-3">
        <Text className="text-lg font-bold">{type}</Text>
        {source && <Text className="text-gray-500 text-sm">{source}</Text>}
      </View>
      <View className='items-end'>
        <Text
            className={clsx('text-lg font-bold', isIncome ? 'text-green-500' : 'text-red-500')}
        >
            EG {amount.toLocaleString()}
        </Text>
        <Text className="text-gray-400 text-sm">{time}</Text>
      </View>
    </View>
  );
};

export default TransactionCard;
