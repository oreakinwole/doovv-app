import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import InputField from '~/components/Input';
import CustomButton from '~/components/Button';
import { SelectField } from '~/components/Select';
import { vehicleColours, VehicleType } from '~/db/options';
import FullPageModalLayout from '~/layout/FullPageModalLayout';
import { Vehicles } from '~/db/register';
import { Vehicle } from '~/types';

interface VehicleModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  vehicleStep: number;
  setVehicleStep: (step: number) => void;
  vehicleData: Vehicle;
  updateVehicleData: (field: string, value: any) => void;
  onSubmitVehicle: () => void;
  loading?: boolean;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  modalVisible,
  setModalVisible,
  vehicleStep,
  setVehicleStep,
  vehicleData,
  updateVehicleData,
  loading = false,
  onSubmitVehicle
}) => {
  return (
    <FullPageModalLayout
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      classname={''}
    >
      {vehicleStep === 1 && (
        <TouchableOpacity
          style={tw`flex-row items-center mb-4`}
          onPress={() => setVehicleStep(0)}
        >
          <Ionicons name="chevron-back" size={20} color="#000" />
          <Text style={tw`text-sm ml-2`}>Step 1</Text>
        </TouchableOpacity>
      )}

      <Text style={tw`text-xl font-bold mb-2`}>Register Your Vehicles</Text>
      <Text style={tw`text-gray-500 mb-5`}>Register each vehicle in your fleet.</Text>
      
      {vehicleStep === 0 ? (
        <>
          {Vehicles.map((vehicle, index) => (
            <View key={vehicle.id}>
              <TouchableOpacity
                style={tw`flex-row items-center justify-between py-4 ${index > 0 ? 'opacity-50' : ''}`}
                onPress={() => index === 0 && setVehicleStep(1)}
                disabled={index > 0}
              >
                <View style={tw`flex-row items-center`}>
                  <MaterialCommunityIcons name="truck-delivery-outline" size={24} color="#000" />
                  <Text style={tw`text-lg ml-4`}>{vehicle.name}</Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  {/* <Text style={tw`text-sm text-red-500 mr-2`}>Unregistered</Text> */}
                  <Ionicons name="chevron-forward" size={18} color="#000" />
                </View>
              </TouchableOpacity>
              <View style={tw`h-px bg-gray-200`} />
            </View>
          ))}
        </>
      ) : (
        <>
          <SelectField
            label="Vehicle type"
            placeholder="Select Your Vehicle type"
            options={VehicleType}
            value={vehicleData.vehicleType}
            onChange={(value) => updateVehicleData('vehicleType', value)}
          />
          <InputField 
            label="Vehicle Maker/Brand" 
            placeholder="Enter Vehicle Maker/Brand" 
            value={vehicleData.vehicleMaker} 
            onChangeText={(value) => updateVehicleData('vehicleMaker', value)} 
          />
          <SelectField
            label="Vehicle color"
            placeholder="Select Your Vehicle color"
            options={vehicleColours}
            value={vehicleData.vehicleColour}
            onChange={(value) => updateVehicleData('vehicleColour', value)}
          />
          <InputField 
            label="Vehicle Plate Number" 
            placeholder="Enter Plate Number" 
            value={vehicleData.plateNo} 
            onChangeText={(value) => updateVehicleData('plateNo', value)} 
          />

          <View style={tw`p-2 my-5`}>
            <CustomButton 
                label={loading ? 'Processing...' : 'Save'}
              onPress={onSubmitVehicle} 
              variant='solid' 
            />
          </View>
        </>
      )}
    </FullPageModalLayout>
  );
};