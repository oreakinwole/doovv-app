import { View, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { Feather } from '@expo/vector-icons';
import { Text } from 'react-native';

type Props = {
  label?: string;
  placeholder: string;
  icon?: keyof typeof Feather.glyphMap;
  secureTextEntry?: boolean;
  value?: string;
  background?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  onBlur?: (e: any) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

export default function InputField({ label, placeholder, icon, secureTextEntry = false, value, onChangeText, background, keyboardType }: Props) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const [isError, setIsError] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleBlur = () => {
    if (!value || value.trim() === "") {
      setIsError(true);
    } else {
      setIsError(false);
    }
  };

  return (
    <View style={tw`mb-5`}>
      {label && (
        <Text style={tw`text-[#100F0D] text-[16px] font-medium mb-2`}>
          {label}
        </Text>
      )}
      <View
        style={tw`flex-row items-center rounded-xl px-4 py-3 ${background || `bg-white`} ${isError ? "border border-red-500" : ""
          }`}
      >
        {icon && <Feather name={icon} size={20} color="#999" />}
        <TextInput
          style={tw`ml-2 flex-1 py-1 text-[17px]`}
          placeholder={placeholder}
          placeholderTextColor={"#9E9392"}
          secureTextEntry={!isPasswordVisible}
          value={value}
          onChangeText={(text) => {
            if (onChangeText) {
              onChangeText(text);
            }
          }}
          onBlur={handleBlur}
          keyboardType={keyboardType || 'default'}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        )}
      </View>
      {isError && (
        <Text style={tw`text-red-500 text-[14px] mt-1`}>
          This field is required.
        </Text>
      )}
    </View>
  );
}