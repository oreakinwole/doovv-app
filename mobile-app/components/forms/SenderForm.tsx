import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import InputField from '~/components/Input';
import { Link } from 'expo-router';
import CustomButton from '~/components/Button';
import { RegisterCourierPayload, UserRole } from '~/types';

interface SenderFormProps {
  onSubmit: () => void;
  loading: boolean;
  registrationData: RegisterCourierPayload;
  updateRegistrationData: (field: keyof RegisterCourierPayload, value: any) => void;
  setRole: (role: UserRole) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  phone: Yup.string()
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

interface SenderFormValues {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export const SenderForm: React.FC<SenderFormProps> = ({ 
  onSubmit, 
  loading, 
  registrationData, 
  updateRegistrationData,
  setRole 
}) => {
  const initialValues: SenderFormValues = {
    name: registrationData.name,
    phone: registrationData.phone,
    email: registrationData.email,
    password: registrationData.password,
  };

  return (
    <View style={tw`px-5 py-8 flex-1 justify-center`}>
      <TouchableOpacity
        onPress={() => setRole('')}
        style={tw`w-8 h-8 rounded-full border border-gray-300 bg-white items-center justify-center mb-4`}
      >
        <Ionicons name="chevron-back" size={16} color="#FF6400" />
      </TouchableOpacity>

      <View style={tw`mb-6`}>
        <Text style={tw`text-2xl font-bold text-[#100F0D] mb-2`}>Sign Up as a Sender</Text>
        <Text style={tw`text-gray-600 text-base leading-5`}>
          Easily send packages to any destination with trusted couriers.
        </Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
          <>
            <View style={tw`mb-6`}>
              <View style={tw`mb-4`}>
                <InputField 
                  label="Full Name" 
                  placeholder="Enter your full name" 
                  value={values.name} 
                  onChangeText={(text) => {
                    handleChange('name')(text);
                    updateRegistrationData('name', text);
                  }}
                  onBlur={handleBlur('name')}
                />
                {touched.name && errors.name && (
                  <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>
                    {errors.name}
                  </Text>
                )}
              </View>

              <View style={tw`mb-4`}>
                <InputField 
                  label="Phone Number" 
                  placeholder="Enter your phone number" 
                  value={values.phone} 
                  onChangeText={(text) => {
                    handleChange('phone')(text);
                    updateRegistrationData('phone', text);
                  }}
                  onBlur={handleBlur('phone')}
                  keyboardType="phone-pad"
                />
                {touched.phone && errors.phone && (
                  <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>
                    {errors.phone}
                  </Text>
                )}
              </View>

              <View style={tw`mb-4`}>
                <InputField 
                  label="Email Address" 
                  placeholder="Enter your email" 
                  value={values.email} 
                  onChangeText={(text) => {
                    handleChange('email')(text);
                    updateRegistrationData('email', text);
                  }}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {touched.email && errors.email && (
                  <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>
                    {errors.email}
                  </Text>
                )}
              </View>

              <View>
                <InputField 
                  label="Create Password" 
                  placeholder="Enter a secure password" 
                  value={values.password} 
                  onChangeText={(text) => {
                    handleChange('password')(text);
                    updateRegistrationData('password', text);
                  }}
                  onBlur={handleBlur('password')}
                  secureTextEntry 
                />
                {touched.password && errors.password && (
                  <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>
                    {errors.password}
                  </Text>
                )}
              </View>
            </View>

            <Text style={tw`text-sm text-gray-600 mb-6 leading-5`}>
              By signing up, you agree to our{" "}
              <Link href="/" style={tw`text-[#FF6400] font-medium`}>
                Terms & Conditions
              </Link>
              {" "}and{" "}
              <Link href="/" style={tw`text-[#FF6400] font-medium`}>
                Privacy Policy
              </Link>
            </Text>

            <CustomButton 
              label="Sign Up" 
              onPress={handleSubmit} 
              variant="solid" 
              loading={loading}
            />
          </>
        )}
      </Formik>

      <View style={tw`flex-row justify-center items-center mt-6`}>
        <Text style={tw`text-[#100F0D] text-base`}>Already have an account? </Text>
        <Link href="/authentication/login" style={tw`text-[#FF6400] font-medium text-base`}>
          Sign In
        </Link>
      </View>
    </View>
  );
};