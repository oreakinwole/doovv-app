import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';

interface SelectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  handleClick: () => void;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({ 
  title, 
  description, 
  icon, 
  handleClick 
}) => {
  return (
    <TouchableOpacity 
      style={tw`bg-white rounded-xl mb-4 p-4 flex-row justify-between items-center shadow-sm`} 
      onPress={handleClick}
    >
      <View style={tw`flex-1`}>
        <Text style={tw`text-orange-500 text-xl font-bold mb-1`}>{title}</Text>
        <Text style={tw`text-gray-700`}>{description}</Text>
      </View>
      <View style={tw`ml-4`}>
        {icon}
      </View>
    </TouchableOpacity>
  );
};