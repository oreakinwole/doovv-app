import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import Toast from 'react-native-toast-message';
import tw from 'twrnc';
import InputField from '~/components/Input';
import CustomButton from '~/components/Button';
import LayoutPage from '~/layout/PageLayout';
import { AppleLogo, Facebook, FaceIDIcon, GoogleLogo, RoutagLogo } from '~/assets/svgs';
import { useAuth } from '~/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, loading, isAuthenticated, user } = useAuth();

 
useEffect(() => {
  if (isAuthenticated && user) {

    const accountType = user?.accountType || user?.account?.accountType;
    
    switch (accountType?.toLowerCase()) {
      case 'customer':
        router.replace('/sender/tabs/Home');
        break;
      case 'courier':
        router.replace('/i-courier/tabs/Home');
        break;
      case 'business':
        router.replace('/b-courier/tabs/Home');
        break;
      default:
        return;
    }
  }
}, [isAuthenticated, user]); 

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Please fill all required fields',
        position: 'top'
      });
    } else {
      try {
       await login(email, password);
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: error.response?.data?.message || 'An error occurred',
          position: 'top'
        });
      }
    }
  };

  return (
    <LayoutPage pageLabel='' noscroll classname='flex-1 justify-center items-center'>
      <View style={tw`px-4`}>
        <RoutagLogo />
        <Text style={tw`text-[#100F0D] text-[20px] font-semibold my-5`}>Welcome Back!</Text>
        <Text style={tw`text-gray-500 mb-5`}>Log in to continue.</Text>

        <View style={tw`my-4`}>
          <InputField label="Email" placeholder="example@you.com" value={email} onChangeText={setEmail} />
          <InputField label="Password" placeholder="******" value={password} onChangeText={setPassword} secureTextEntry />
          <Link href="/authentication/forgot-password" asChild>
            <TouchableOpacity style={tw`self-start`}>
              <Text style={tw`text-[#FF6400]`}>Forgot Password</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={tw`flex-row w-full justify-evenly`}>
          <CustomButton label='Face ID' onPress={() => { }} variant='black' icon={<FaceIDIcon />} width='w-[45%]' />
          <CustomButton label='Login' onPress={handleLogin} variant='solid' width='w-[45%]' loading={loading} />
        </View>

        <View style={tw`flex-row justify-center my-5`}>
          <Text style={tw`text-[#100F0D]`}>New to Route Tag?</Text>
          <Link href="/authentication/create-account" style={tw`text-[#FF6400] ml-1`}>
            Sign Up
          </Link>
        </View>
      </View>
    </LayoutPage>
  );
}