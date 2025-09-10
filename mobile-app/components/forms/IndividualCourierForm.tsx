import { View, Text, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import tw from 'twrnc';
import * as DocumentPicker from "expo-document-picker";
import { Formik } from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

import InputField from '~/components/Input';
import { Link } from 'expo-router';
import CustomButton from '~/components/Button';
import { SelectField } from '~/components/Select';
import { RegisterCourierPayload, UserRole } from '../../types';
import { MeansOfTravel } from '~/db/options';
import UploadDocumentInput from '../UploadFile';

interface IndividualCourierFormProps {
  onSubmit: () => void;
  loading?: boolean;
  document: DocumentPicker.DocumentPickerResult | null;
  setDocument: (document: DocumentPicker.DocumentPickerResult | null) => void;
  utilityBillDocument: DocumentPicker.DocumentPickerResult | null;
  setUtilityBillDocument: (document: DocumentPicker.DocumentPickerResult | null) => void;
  setRole: (role: UserRole) => void;
  registrationData: RegisterCourierPayload;
  updateRegistrationData: (field: keyof RegisterCourierPayload, value: any) => void;
}

interface CourierFormValues {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  password: string;
  dob: string;
  nin: string;
  bvn: string;
  meansOfTravel: string;
}

const validationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastname: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .required('Last name is required'),
  phone: Yup.string()
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  dob: Yup.string()
    .required('Date of birth is required'),
  nin: Yup.string()
    .min(11, 'NIN must be at least 11 digits'),
  bvn: Yup.string()
    .min(11, 'BVN must be at least 11 digits'),
  meansOfTravel: Yup.string().required('Means of travel is required'),
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

export const IndividualCourierForm: React.FC<IndividualCourierFormProps> = ({
  onSubmit,
  loading = false,
  document,
  setDocument,
  utilityBillDocument,
  setUtilityBillDocument,
  setRole,
  registrationData,
  updateRegistrationData
}) => {
  const [idType, setIdType] = useState<'nin' | 'bvn'>('nin');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const initialValues: CourierFormValues = {
    firstname: registrationData.firstname,
    lastname: registrationData.lastname,
    phone: registrationData.phone,
    email: registrationData.email,
    password: registrationData.password,
    dob: registrationData.dob,
    nin: registrationData.nin || '',
    bvn: registrationData.bvn || '',
    meansOfTravel: registrationData.meansOfTravel || '',
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

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={tw`px-5 py-8 flex-1 justify-center`}>
      <TouchableOpacity
        onPress={() => setRole('')}
        style={tw`w-8 h-8 rounded-full border border-gray-300 bg-white items-center justify-center mb-4`}
      >
        <Ionicons name="chevron-back" size={16} color="#FF6400" />
      </TouchableOpacity>

      <Text style={tw`text-xl font-bold mb-2`}>Sign Up as a Courier</Text>
      <Text style={tw`text-gray-500 mb-5`}>Earn money by delivering packages along your travel route.</Text>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isValid }) => (
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
                <Text style={tw`text-sm font-medium mb-2`}>Date of Birth</Text>
                <TouchableOpacity
                  style={tw` rounded-lg py-4 px-3 flex-row justify-between items-center bg-white`}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={tw`${values.dob ? 'text-black' : 'text-gray-400'} text-[17px]`}>
                    {values.dob || 'Select Date of Birth'}
                  </Text>
                  <Text style={tw`text-gray-500`}>📅</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={values.dob ? new Date(values.dob) : new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selectedDate && event.type !== 'dismissed') {
                        const formattedDate = formatDate(selectedDate);
                        setFieldValue('dob', formattedDate);
                        updateRegistrationData('dob', formattedDate);
                      }
                    }}
                    maximumDate={new Date()}
                  />
                )}

                {touched.dob && errors.dob && (
                  <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>
                    {errors.dob}
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

              <View style={tw`mb-4`}>
                <SelectField
                  label="Means of Travel"
                  placeholder="Select Your Travel Means"
                  options={MeansOfTravel}
                  value={values.meansOfTravel}
                  onChange={(value) => {
                    setFieldValue('meansOfTravel', value);
                    updateRegistrationData('meansOfTravel', value);
                  }}
                />
                {touched.meansOfTravel && errors.meansOfTravel && (
                  <Text style={tw`text-red-500 text-sm mt-1 ml-1`}>
                    {errors.meansOfTravel}
                  </Text>
                )}
              </View>

              <UploadDocumentInput
                label="Upload Valid Licence"
                document={document}
                setDocument={setDocument}
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
              label={loading ? 'Processing...' : 'Sign Up'}
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