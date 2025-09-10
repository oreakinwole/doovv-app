import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import CustomButton from '~/components/Button';
import { LocationCoordinates } from '~/services/locationService';

type LocationCardContentProps = {
  fromLocation: LocationCoordinates | null;
  toLocation: LocationCoordinates | null;
  onSendPackage: () => void;
  onEditLocation: (inputType: 'from' | 'to') => void;
  canProceed: boolean;
};

const LocationCardContent = ({
  fromLocation,
  toLocation,
  onSendPackage,
  onEditLocation,
  canProceed,
}: LocationCardContentProps) => {
  const truncateAddress = (address: string, maxLength: number = 35) => {
    return address.length > maxLength ? `${address.substring(0, maxLength)}...` : address;
  };

  if (!fromLocation || !toLocation) {
    return (
      <>
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View style={tw`flex-row items-center flex-1`}>
            <Entypo name="location-pin" size={20} color="#F97316" />
            <Text style={tw`text-base font-semibold text-gray-800 ml-1 flex-1`}>
              {fromLocation ? truncateAddress(fromLocation.address) : 'Select pickup location'}
            </Text>
          </View>
          <TouchableOpacity 
            style={tw`flex-row items-center bg-gray-100 px-3 py-1 rounded-full`}
            onPress={() => onEditLocation('from')}
          >
            <Feather name="edit-2" size={14} color="black" />
            <Text style={tw`ml-1 text-xs font-medium`}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`flex-row items-center justify-between mb-5`}>
          <TouchableOpacity
            style={tw`bg-gray-100 flex-row items-center rounded-xl px-4 py-3 flex-1`}
            onPress={() => onEditLocation('to')}
          >
            <Feather name="search" size={18} color="gray" />
            <Text style={tw`ml-2 text-sm ${toLocation ? 'text-gray-800' : 'text-gray-500'}`}>
              {toLocation ? truncateAddress(toLocation.address) : 'To Where'}
            </Text>
          </TouchableOpacity>
        </View>

        <CustomButton 
          label="Send package" 
          onPress={onSendPackage} 
          variant={canProceed ? "solid" : "outline"}
        />
        
        {!canProceed && (
          <Text style={tw`text-xs text-gray-500 text-center mt-2`}>
            Select pickup and destination to continue
          </Text>
        )}
      </>
    );
  }

  return (
    <>
      {/* Route Header */}
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <Text style={tw`text-lg font-bold text-gray-900`}>Your Route</Text>
        <TouchableOpacity 
          style={tw`flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full`}
          onPress={() => onEditLocation('from')}
        >
          <Feather name="edit-2" size={14} color="#3B82F6" />
          <Text style={tw`ml-1 text-xs font-medium text-blue-600`}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Route Display */}
      <View style={tw`bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm`}>
        {/* From Location */}
        <View style={tw`flex-row items-start mb-4`}>
          <View style={tw`items-center mr-3 mt-1`}>
            <View style={tw`w-3 h-3 rounded-full bg-green-500`} />
            <View style={tw`w-0.5 h-8 bg-gray-300 mt-2`} />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xs font-medium text-gray-500 uppercase tracking-wide mb-1`}>
              FROM
            </Text>
            <Text style={tw`text-base font-semibold text-gray-900 leading-5`}>
              {truncateAddress(fromLocation.address, 40)}
            </Text>
          </View>
        </View>

        {/* To Location */}
        <View style={tw`flex-row items-start`}>
          <View style={tw`items-center mr-3 mt-1`}>
            <View style={tw`w-3 h-3 rounded-full bg-red-500`} />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xs font-medium text-gray-500 uppercase tracking-wide mb-1`}>
              TO
            </Text>
            <Text style={tw`text-base font-semibold text-gray-900 leading-5`}>
              {truncateAddress(toLocation.address, 40)}
            </Text>
          </View>
        </View>
      </View>

      {/* Delivery Info Card */}
      <View style={tw`bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6`}>
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <View style={tw`flex-row items-center`}>
            <MaterialIcons name="local-shipping" size={20} color="#F97316" />
            <Text style={tw`text-sm font-semibold text-orange-800 ml-2`}>
              Ready to deliver
            </Text>
          </View>
          <View style={tw`bg-orange-200 px-2 py-1 rounded-full`}>
            <Text style={tw`text-xs font-medium text-orange-800`}>
              Express
            </Text>
          </View>
        </View>
        <Text style={tw`text-sm text-orange-700`}>
          Your package will be picked up and delivered safely
        </Text>
      </View>

      {/* Action Button */}
      <CustomButton 
        label="Send Package" 
        onPress={onSendPackage} 
        variant="solid"
      />
    </>
  );
};

export default LocationCardContent;