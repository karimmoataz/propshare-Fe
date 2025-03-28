import React, { useEffect, useRef } from 'react';
import { View ,Animated } from 'react-native';

interface ProgressBarProps {
  percent: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
}

const ProgressBar = ({
  percent,
  color = '#3498db',
  backgroundColor = '#ecf0f1',
  height = 10
}: ProgressBarProps) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percent > 100 ? 100 : percent < 0 ? 0 : percent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [percent]);

  return (
    <View 
      className="w-full rounded overflow-hidden" 
      style={{ backgroundColor, height }}
    >
      <Animated.View 
        className="h-full rounded"
        style={{ 
          backgroundColor: color,
          width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%']
          })
        }}
      />
    </View>
  );
};

export default ProgressBar;