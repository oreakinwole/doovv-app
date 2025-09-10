import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { CourierData } from '~/types';
import Toast from 'react-native-toast-message';

interface DeliveryData {
  from: {
    address: string;
  };
  to: {
    address: string;
  };
}

type CourierFoundContentProps = {
  courier?: CourierData;
  deliveryData?: DeliveryData | null;
  onChat: () => void;
  onCall: () => void;
  onCancel: () => void;
};

const CourierFoundContent = ({
  courier = {
    id: '1',
    name: 'Josh Ayinde',
    rating: 4.3,
    reviewCount: 54,
    vehicle: {
      type: 'Car',
      model: 'Toyota Corolla',
      plateNumber: 'ABJ- 128JJ'
    }
  },
  deliveryData,
  onChat,
  onCall,
  onCancel
}: CourierFoundContentProps) => {
  const getFromAddress = () => {
    return deliveryData?.from.address || 'Obafemi Awolowo way';
  };

  const getToAddress = () => {
    return deliveryData?.to.address || '37A Opebi Road';
  };

  const handleCancel = () => {
    Toast.show({
      type: 'success',
      text1: 'Delivery cancelled and restarted',
      position: 'top'
    });
    onCancel();
  };

  return (
    <>
      <View style={tw`flex-row justify-between items-center px-4 mb-4`}>
        <Text style={tw`text-lg font-semibold text-gray-800`}>Courier Found</Text>
        <TouchableOpacity
          style={tw`p-2`}
          onPress={handleCancel}
        >
          <MaterialIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={tw`items-center mb-6 px-4`}>
        <View style={tw`w-20 h-20 rounded-full bg-gray-200 mb-3 overflow-hidden`}>
          {courier.avatar ? (
            <Image 
              source={{ uri: courier.avatar }} 
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : (
            <View style={tw`w-full h-full bg-gray-300 items-center justify-center`}>
              <Feather name="user" size={32} color="#666" />
            </View>
          )}
        </View>

        <Text style={tw`text-xl font-semibold text-gray-800 mb-1`}>
          {courier.name}
        </Text>

        <View style={tw`flex-row items-center mb-4`}>
          <MaterialIcons name="star" size={16} color="#FFC107" />
          <Text style={tw`text-sm text-gray-600 ml-1`}>
            {courier.rating} ({courier.reviewCount})
          </Text>
        </View>
      </View>

      <View style={tw`px-4 mb-6`}>
        <View style={tw`flex-row items-start mb-6`}>
          <View style={tw`mr-3 items-center`}>
            <View style={tw`w-3 h-3 rounded-full bg-orange-500`} />
            <View style={tw`h-8 w-0.5 bg-orange-200 my-1`} />
            <View style={tw`w-3 h-3 rounded-full bg-orange-500`} />
          </View>

          <View style={tw`flex-1 mt-[-2px]`}>
            <Text style={tw`text-sm text-gray-800 mb-6`}>
              {getFromAddress()}
            </Text>
            <Text style={tw`text-sm text-gray-800`}>
              {getToAddress()}
            </Text>
          </View>
        </View>

        <View style={tw`bg-orange-100 rounded-lg p-3 mb-4`}>
          <Text style={tw`text-sm text-orange-800`}>
            {courier.vehicle.type} ({courier.vehicle.model})
          </Text>
          <Text style={tw`text-xs text-orange-600 mt-1`}>
            {courier.vehicle.plateNumber}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row px-4 gap-3`}>
        <TouchableOpacity
          style={tw`flex-1 bg-black flex-row items-center justify-center py-4 rounded-lg relative`}
          onPress={onChat}
        >
          <Feather name="message-circle" size={20} color="white" />
          <Text style={tw`text-white font-semibold ml-2`}>Chat</Text>
          <View style={tw`absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full items-center justify-center`}>
            <Text style={tw`text-white text-xs font-bold`}>1</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`flex-1 bg-orange-500 flex-row items-center justify-center py-4 rounded-lg`}
          onPress={onCall}
        >
          <Feather name="phone" size={20} color="white" />
          <Text style={tw`text-white font-semibold ml-2`}>Call</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CourierFoundContent;