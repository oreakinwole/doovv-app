import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';

type OTPInputProps = {
  code: string[];
  setCode: (val: string[]) => void;
  onComplete?: (code: string) => void; // Optional callback when code is complete
};

export default function OTPInput({ code, setCode, onComplete }: OTPInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const isComplete = code.every((digit) => digit !== '');
    if (isComplete) {
      setLoading(true);

      // Simulate delay or trigger callback
      setTimeout(() => {
        setLoading(false);
        if (onComplete) {
          onComplete(code.join(''));
        }
      }, 1000); // simulate 1s delay
    }
  }, [code]);

  return (
    <View style={tw`flex-row justify-between items-center w-full mb-4`}>
      {code.map((digit, idx) => (
        <TextInput
          key={idx}
          ref={(ref) => (inputRefs.current[idx] = ref)}
          value={digit}
          onChangeText={(text) => handleChange(text, idx)}
          onKeyPress={(e) => handleKeyPress(e, idx)}
          maxLength={1}
          keyboardType="number-pad"
          returnKeyType="done"
          editable={!loading}
          style={tw`w-12 h-13 bg-[#FFDCD7] rounded-xl text-xl text-center`}
        />
      ))}
      {loading && (
        <View style={tw`absolute right-[-30] top-2`}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      )}
    </View>
  );
}
