import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import InputField from '~/components/Input';
import CustomButton from '~/components/Button';
import { SelectField } from '~/components/Select';
import { VehicleType } from '~/db/options';
import FullPageModalLayout from '~/layout/FullPageModalLayout';
import { Drivers } from '~/db/register';
import { DriverData } from '~/app/b-courier/tabs/Account';

interface DriverModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  driverStep: number;
  setDriverStep: (step: number) => void;
  driverData: DriverData;
  updateDriverData: (field: keyof DriverData, value: any) => void;
}

export const DriverModal: React.FC<DriverModalProps> = ({
  modalVisible,
  setModalVisible,
  driverStep,
  setDriverStep,
  driverData,
  updateDriverData
}) => {
  return (
    <FullPageModalLayout
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      classname={''}
    >
      <Text style={tw`text-xl font-bold mb-2`}>Register Your Drivers</Text>
      <Text style={tw`text-gray-500 mb-5`}>Manage a fleet and handle bulk deliveries with ease.</Text>
      
      {driverStep === 0 ? (
        <>
          {Drivers.map((driver) => (
            <View key={driver.id}>
              <TouchableOpacity
                style={tw`flex-row items-center justify-between py-4`}
                onPress={() => setDriverStep(1)}
              >
                <View style={tw`flex-row items-center`}>
                  <MaterialCommunityIcons name="steering" size={24} color="#000" />
                  <Text style={tw`text-lg ml-4`}>{driver.name}</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-sm text-red-500 mr-2`}>Unregistered</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000" />
                </View>
              </TouchableOpacity>
              <View style={tw`h-px bg-gray-200`} />
            </View>
          ))}

          <View style={tw`p-2 my-5`}>
            <CustomButton 
              label='Sign up' 
              onPress={() => router.push("/authentication/verification")} 
              variant='solid' 
            />
          </View>
        </>
      ) : (
        <>
          <InputField 
            label="Driver Name" 
            placeholder="Enter Name" 
            value={driverData.fullname} 
            onChangeText={(value) => updateDriverData('fullname', value)} 
          />
          <InputField 
            label="Driver Username" 
            placeholder="Create Username" 
            value={driverData.email} 
            onChangeText={(value) => updateDriverData('email', value)} 
          />
          <InputField 
            label="Phone Number" 
            placeholder="Enter Phone Number" 
            value={driverData.phone} 
            onChangeText={(value) => updateDriverData('phone', value)} 
          />
          <InputField 
            label="Create Password" 
            placeholder="Password" 
            value={driverData.password} 
            onChangeText={(value) => updateDriverData('password', value)} 
            secureTextEntry 
          />
          <SelectField
            label="Assigned Vehicle"
            placeholder="Select Assigned Vehicle"
            options={VehicleType}
            value={driverData.vehicleId}
            onChange={(value) => updateDriverData('vehicleId', value)}
          />
          
          <View style={tw`p-1 my-5`}>
            <CustomButton 
              label='Save' 
              onPress={() => setDriverStep(0)} 
              variant='solid' 
            />
          </View>
        </>
      )}
    </FullPageModalLayout>
  );
};