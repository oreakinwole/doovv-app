import { ActivityIndicator, Text, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import tw from 'twrnc';

type Props = {
  label: string;
  variant?: 'solid' | 'outline' | 'black' | 'white';
  onPress: any;
  icon?: any
  width?: 'w-full' | 'w-[50%]' | 'w-[45%]' | 'w-[40%]' | 'w-[30%]' | 'w-[20%]';
  loading?: boolean;
  style?: ViewStyle;
};

export default function CustomButton({ label, variant, onPress, icon, width = 'w-full', loading = false, style }: Props) {
  const baseStyles = 'py-4 rounded-[15px] items-center justify-center mb-3';
  const customWhite = 'bg-white';
  const solidStyles = 'bg-[#FF6400]';
  const blackStyles = 'bg-[#100F0D]'
  const outlineStyles = 'border border-gray-800';

  const buttonStyle = tw`${baseStyles} ${variant === 'solid' ? solidStyles : variant === 'black' ? blackStyles : variant === 'white' ? customWhite : outlineStyles
    } ${width} flex-row gap-x-2`;
  const textStyle = tw`text-base font-semibold ${variant === 'solid' || variant === 'black' ? 'text-white' : variant === 'white' ? 'text-[#FF6400]' : 'text-black'}`;

  return (
    <TouchableOpacity onPress={onPress} style={[buttonStyle, { cursor: "pointer" }, style]} disabled={loading}>
      {loading ? (<ActivityIndicator />) : (<>{icon}
        <Text style={textStyle}>{label}</Text></>)}

    </TouchableOpacity>
  );
}