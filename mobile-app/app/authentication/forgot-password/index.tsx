// screens/SignUpScreen.tsx
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import InputField from '~/components/Input';
import { Link, router } from 'expo-router';
import CustomButton from '~/components/Button';
import LayoutPage from '~/layout/PageLayout';
import { requests } from '~/api/requests';
import { passRoute, UserAuthentication } from '~/utils/authentication.flow';
import Toast from 'react-native-toast-message';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Please fill all required fields',
        position: 'top'
      });
    } else {
      setLoading(true);
      try {
        const response = await requests.forgotPassword(email);

        Toast.show({
          type: 'success',
          text1: response.data.message,
          position: 'top'
        });

        router.push({
          pathname: '/authentication/reset-password',
          params: { email: email }
        });
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: error.response?.data?.message || "An error occurred",
          position: 'top'
        });
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <LayoutPage pageLabel='' noscroll classname='flex-1 justify-center'>
      <View style={tw`p-4`}>
        <Text style={tw`text-[#100F0D] text-[20px] font-semibold my-5`}>Forgot Password</Text>
        <Text style={tw`text-gray-500 mb-5`}>Enter the email attached to your Route Tag account </Text>

        <View style={tw`my-4`}>
          <InputField label="Email Address" placeholder="example@you.com" value={email} onChangeText={setEmail} />
        </View>

        <CustomButton
          label='Send OTP'
          onPress={() => handleForgotPassword()}
          variant='solid'
          loading={loading}
          style={tw`mt-20`}
        />
      </View>
    </LayoutPage>
  );
}