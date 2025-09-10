import { View, Text, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputField from '~/components/Input';
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import CustomButton from '~/components/Button';
import { RegisterCourierPayload, UserRole } from '../../types';
import UploadDocumentInput from '../UploadFile';

interface BusinessCourierFormProps {
  registrationData: RegisterCourierPayload;
  updateRegistrationData: (field: keyof RegisterCourierPayload, value: any) => void;
  loading?: boolean;
  onSubmit: () => void;
  cacDocument: DocumentPicker.DocumentPickerResult | null;
  setCacDocument: (document: DocumentPicker.DocumentPickerResult | null) => void;
  utilityBillDocument: DocumentPicker.DocumentPickerResult | null;
  setUtilityBillDocument: (document: DocumentPicker.DocumentPickerResult | null) => void;
  setRole: (role: UserRole) => void;
}

interface BusinessFormValues {
  firstname: string;
  lastname: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  nin: string;
  bvn: string;
}

const validationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastname: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  name: Yup.string()
    .min(2, 'Business name must be at least 2 characters')
    .required('Business name is required'),
  phone: Yup.string()
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  nin: Yup.string()
    .min(11, 'NIN must be at least 11 digits'),
  bvn: Yup.string()
    .min(11, 'BVN must be at least 11 digits'),
}).test('nin-or-bvn', 'Either NIN or BVN is required', function (values) {
  const { nin, bvn } = values;
  if (!nin && !bvn) {
    return this.createError({
      path: 'nin',
      message: 'Either NIN or BVN is required'
    });
  }
  return true;
});

export const BusinessCourierForm: React.FC<BusinessCourierFormProps> = ({
  registrationData,
  updateRegistrationData,
  loading = false,
  onSubmit,
  cacDocument,
  setCacDocument,
  utilityBillDocument,
  setUtilityBillDocument,
  setRole
}) => {

  const [idType, setIdType] = useState<'nin' | 'bvn'>('nin');

  const initialValues: BusinessFormValues = {
    firstname: registrationData.firstname,
    lastname: registrationData.lastname,
    name: registrationData.name,
    phone: registrationData.phone,
    email: registrationData.email,
    password: registrationData.password,
    nin: registrationData.nin || '',
    bvn: registrationData.bvn || '',
  };


  const handleIdTypeChange = (type: 'nin' | 'bvn', setFieldValue: any) => {
    setIdType(type);
    if (type === 'nin') {
      setFieldValue('bvn', '');
      updateRegistrationData('bvn', '');
    } else {
      setFieldValue('nin', '');
      updateRegistrationData('nin', '');
    }
  };

  return (
    <View style={tw`px-5 py-8 flex-1 justify-center`}>
      <TouchableOpacity
        onPress={() => setRole('')}
        style={tw`w-8 h-8 rounded-full border border-gray-300 bg-white items-center justify-center mb-4`}
      >
        <Ionicons name="chevron-back" size={16} color="#FF6400" />
      </TouchableOpacity>

      <Text style={tw`text-xl font-bold mb-2`}>Sign Up as a Business</Text>
      <Text style={tw`text-gray-500 mb-5`}>Manage a fleet and handle bulk deliveries with ease.</Text>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <>
            <View style={tw`my-4`}>
              <View style={tw`mb-4`}>
                <InputField
                  label="First Name"
                  placeholder="Enter First Name"
                  value={values.firstname}
                  onChangeText={(text) => {
                    handleChange('firstname')(text);
                    updateRegistrationData('firstname', text);
                  }}
                  onBlur={handleBlur('firstname')}
                />
                {touched.firstname && errors.firstname && (
                  <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>
                    {errors.firstname}
                  </Text>
                )}
              </View>

              <View style={tw`mb-4`}>
                <InputField
                  label="Last Name"
                  placeholder="Enter Last Name"
                  value={values.lastname}
                  onChangeText={(text) => {
                    handleChange('lastname')(text);
                    updateRegistrationData('lastname', text);
                  }}
                  onBlur={handleBlur('lastname')}
                />
                {touched.lastname && errors.lastname && (
                  <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>
                    {errors.lastname}
                  </Text>
                )}
              </View>

              <View style={tw`mb-4`}>
                <InputField
                  label="Business Name"
                  placeholder="Enter Business Name"
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
                  placeholder="Enter Phone Number"
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
                  label="Email"
                  placeholder="Enter Email"
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

              <View style={tw`mb-4`}>
                <InputField
                  label="Create Password"
                  placeholder="Password"
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

              <View style={tw`mb-4`}>
                <Text style={tw`text-sm font-medium mb-2`}>Identification Type</Text>
                <View style={tw`flex-row mb-3`}>
                  <TouchableOpacity
                    style={tw`flex-1 p-3 border rounded-l-lg ${idType === 'nin' ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'}`}
                    onPress={() => handleIdTypeChange('nin', setFieldValue)}
                  >
                    <Text style={tw`text-center ${idType === 'nin' ? 'text-white font-semibold' : 'text-gray-700'}`}>
                      NIN
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={tw`flex-1 p-3 border rounded-r-lg ${idType === 'bvn' ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'}`}
                    onPress={() => handleIdTypeChange('bvn', setFieldValue)}
                  >
                    <Text style={tw`text-center ${idType === 'bvn' ? 'text-white font-semibold' : 'text-gray-700'}`}>
                      BVN
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {idType === 'nin' ? (
                <View style={tw`mb-4`}>
                  <InputField
                    label="National Identification Number (NIN)"
                    placeholder="Enter your NIN"
                    value={values.nin}
                    onChangeText={(text) => {
                      handleChange('nin')(text);
                      updateRegistrationData('nin', text);
                    }}
                    onBlur={handleBlur('nin')}
                    keyboardType="numeric"
                  />
                  {touched.nin && errors.nin && (
                    <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>
                      {errors.nin}
                    </Text>
                  )}
                </View>
              ) : (
                <View style={tw`mb-4`}>
                  <InputField
                    label="Bank Verification Number (BVN)"
                    placeholder="Enter your BVN"
                    value={values.bvn}
                    onChangeText={(text) => {
                      handleChange('bvn')(text);
                      updateRegistrationData('bvn', text);
                    }}
                    onBlur={handleBlur('bvn')}
                    keyboardType="numeric"
                  />
                  {touched.bvn && errors.bvn && (
                    <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>
                      {errors.bvn}
                    </Text>
                  )}
                </View>
              )}

              <UploadDocumentInput
                label="Upload CAC Document"
                document={cacDocument}
                setDocument={setCacDocument}
              />

              <UploadDocumentInput
                label="Upload Utility Bill"
                document={utilityBillDocument}
                setDocument={setUtilityBillDocument}
              />

              <Text style={tw`text-sm text-gray-600 mb-6 leading-5`}>
                By clicking sign up you're agreeing with our{" "}
                <Link href={"/"} style={tw`text-[#FF6400] font-medium`}>
                  Terms & Conditions & Privacy Policies
                </Link>
              </Text>
            </View>

            <CustomButton
              label={loading ? 'Processing...' : 'Proceed'}
              onPress={handleSubmit}
              variant='solid'
              loading={loading}
            />
          </>
        )}
      </Formik>

      <View style={tw`flex-row justify-center mt-4`}>
        <Text style={tw`text-[#100F0D]`}>Already have an account? </Text>
        <Link href="/authentication/login" style={tw`text-[#FF6400] ml-1 font-medium`}>
          Sign in
        </Link>
      </View>
    </View>
  );
};