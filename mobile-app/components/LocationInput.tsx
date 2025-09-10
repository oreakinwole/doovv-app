import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import tw from 'twrnc';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LocationCoordinates } from '~/services/locationService';

interface LocationInputProps {
  placeholder: string;
  value: string;
  onLocationSelect: (location: LocationCoordinates) => void;
  onSearch?: (text: string) => void;
  onClear?: () => void;
  onFocus?: () => void;
  icon?: 'location-on' | 'search';
  iconColor?: string;
  editable?: boolean;
  autoFocus?: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  value,
  onLocationSelect,
  onSearch,
  onClear,
  onFocus,
  icon = 'search',
  iconColor = '#FF6B37',
  editable = true,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Auto focus when editable becomes true
  useEffect(() => {
    if (autoFocus && editable && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus, editable]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    
    if (onSearch && editable) {
      onSearch(text);
    }
  };

  const handleFocus = () => {
    if (onFocus) {
      onFocus();
    }
    // Focus the input after a short delay to ensure state updates
    setTimeout(() => {
      if (inputRef.current && editable) {
        inputRef.current.focus();
      }
    }, 50);
  };

  const handleClear = () => {
    setInputValue('');
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch('');
    }
  };

  // Handle tap on the entire container when not editable
  const handleContainerPress = () => {
    if (!editable && onFocus) {
      handleFocus();
    }
  };

  return (
    <TouchableOpacity 
      style={tw`bg-white rounded-xl border border-gray-200 p-4`}
      onPress={handleContainerPress}
      activeOpacity={editable ? 1 : 0.7}
      disabled={editable}
    >
      <View style={tw`flex-row items-center`}>
        {icon === 'location-on' ? (
          <MaterialIcons name="location-on" size={24} color={iconColor} />
        ) : (
          <Feather name="search" size={20} color="#666" />
        )}
        <TextInput
          ref={inputRef}
          style={[
            tw`ml-2 text-[16px] flex-1`,
            !editable && tw`color-gray-600`
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={inputValue}
          onChangeText={handleInputChange}
          onFocus={handleFocus}
          editable={editable}
          numberOfLines={1}
          ellipsizeMode="tail"
        />
        {value && onClear && editable && (
          <TouchableOpacity onPress={handleClear} style={tw`p-1`}>
            <MaterialIcons name="clear" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LocationInput;