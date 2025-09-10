import React, { useState } from 'react';
import { Animated, Text } from 'react-native';
import tw from 'twrnc';
import { ToastType } from '~/types';


interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000 }) => {
  const [visible, setVisible] = useState(true);
  const [fadeAnim] = useState(() => {
    const anim = new Animated.Value(0);

    // Show animation
    Animated.timing(anim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Hide animation
    setTimeout(() => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, duration);

    return anim;
  });

  const backgroundStyle = type === 'error' ? tw`bg-red-600` : tw`bg-green-600`;

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        tw`absolute top-0 self-center px-5 py-3 rounded-full z-50`,
        backgroundStyle,
        { opacity: fadeAnim },
      ]}
    >
      <Text style={tw`text-white text-sm`}>{message}</Text>
    </Animated.View>
  );
};

export default Toast;