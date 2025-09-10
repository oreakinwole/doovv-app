import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Feather } from '@expo/vector-icons';

interface DeliveryData {
  from: {
    latitude: number;
    longitude: number;
    address: string;
  };
  to: {
    latitude: number;
    longitude: number;
    address: string;
  };
  noOfPackages: number;
  weightOfPackages: number;
  isFragile: boolean;
  description: string;
  receiver: {
    name: string;
    phone: string;
  };
  productValue: number;
  productImage?: string;
  offerPrice: number;
  packageId?: string;
  deliveryId?: string;
  senderId?: string;
}

type SearchingCouriersContentProps = {
  currentOffer?: number;
  onDecreaseOffer: () => void;
  onIncreaseOffer: () => void;
  onCancelSearch: () => void;
  deliveryData?: DeliveryData | null;
};

const SearchingCouriersContent = ({
  currentOffer = 2700,
  onDecreaseOffer,
  onIncreaseOffer,
  onCancelSearch,
  deliveryData
}: SearchingCouriersContentProps) => {
  const getPackageDescription = () => {
    if (!deliveryData) return '2 Laptops 5kg (each)';
    
    const { noOfPackages, weightOfPackages, description } = deliveryData;
    return `${noOfPackages} ${description} ${weightOfPackages}kg ${noOfPackages > 1 ? '(each)' : ''}`;
  };

  const getFromAddress = () => {
    return deliveryData?.from.address || 'Obafemi Awolowo way';
  };

  const getToAddress = () => {
    return deliveryData?.to.address || '37A Opebi Road';
  };

  return (
    <>
      <View style={tw`items-center mb-6 px-8`}>
        <Text style={tw`text-lg text-black font-medium mb-2`}>Searching for couriers.....</Text>

        <Text style={tw`text-md text-black mb-4`}>Your Offer</Text>

        <View style={tw`flex-row items-center justify-between w-full mb-6`}>
          <TouchableOpacity
            style={tw`bg-[#C0BABA] py-2 px-3 rounded-md`}
            onPress={onDecreaseOffer}>
            <Text style={tw`text-white font-bold`}>— ₦100</Text>
          </TouchableOpacity>

          <Text style={tw`text-xl font-bold text-gray-800`}>₦ {currentOffer.toLocaleString()}</Text>

          <TouchableOpacity
            style={tw`bg-orange-500 py-2 px-3 rounded-md`}
            onPress={onIncreaseOffer}>
            <Text style={tw`text-white font-bold`}>+ ₦100</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`border-t border-dashed border-gray-300 pt-6 px-8`}>
        <View style={tw`flex-row items-start`}>
          <View style={tw`mr-3 items-center`}>
            <View style={tw`w-4 h-4 rounded-full border-2 border-orange-500`} />
            <View style={tw`h-12 w-0.5 bg-orange-200 my-1`} />
            <View style={tw`w-4 h-4 rounded-full border-2 border-orange-500`} />
          </View>

          <View style={tw`flex-1 mt-[-4px]`}>
            <Text style={tw`text-base text-gray-800`} numberOfLines={1} ellipsizeMode="tail">
              {getFromAddress()}
            </Text>
            <View style={tw`h-11.5`} />
            <Text style={tw`text-base text-gray-800`} numberOfLines={1} ellipsizeMode="tail">
              {getToAddress()}
            </Text>
          </View>
        </View>
        
        <View style={tw`flex-row items-center pt-9`}>
          <Feather name="box" size={18} color="#000" />
          <Text style={tw`text-sm text-gray-800 ml-3`}>
            {getPackageDescription()}
          </Text>
          {deliveryData?.isFragile && (
            <View style={tw`ml-2 bg-red-100 px-2 py-1 rounded`}>
              <Text style={tw`text-xs text-red-600 font-medium`}>Fragile</Text>
            </View>
          )}
        </View>

        {deliveryData && (
          <View style={tw`mt-4 p-3 bg-gray-50 rounded-lg`}>
            <Text style={tw`text-sm text-gray-600 mb-1`}>Receiver</Text>
            <Text style={tw`text-base font-medium`}>{deliveryData.receiver.name}</Text>
            <Text style={tw`text-sm text-gray-600`}>{deliveryData.receiver.phone}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={tw`mt-4 bg-orange-500 py-3 rounded-lg items-center`}
          onPress={onCancelSearch}
        >
          <Text style={tw`text-white font-bold`}>Cancel Search</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SearchingCouriersContent;