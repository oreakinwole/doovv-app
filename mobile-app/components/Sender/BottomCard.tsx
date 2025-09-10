import React from 'react';
import { View } from 'react-native';
import tw from 'twrnc';

type BottomCardProps = {
  children: React.ReactNode;
};

const BottomCard = ({ children }: BottomCardProps) => {
  return (
    <View style={tw`absolute bottom-0 w-full bg-white rounded-t-3xl px-5 pt-5 pb-4 shadow-lg`}>
      {children}
    </View>
  );
};

export default BottomCard;