import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-simple-toast';
import { LocationCoordinates } from '~/services/locationService';

interface DeliveryDetailsProps {
  onFindCourier: (data: any) => void;
  isLoading: boolean;
  fromLocation: LocationCoordinates | null;
  toLocation: LocationCoordinates | null;
}

const DeliveryDetails = ({ onFindCourier, isLoading, fromLocation, toLocation }: DeliveryDetailsProps) => {
  const [fragilePackage, setFragilePackage] = useState(true);
  const [packageWeight, setPackageWeight] = useState('12');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [offerPrice, setOfferPrice] = useState('0');
  const [description, setDescription] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [productValue, setProductValue] = useState('');
  const [productImage, setProductImage] = useState<string | null>(null);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show('Permission to access camera roll is required!', Toast.LONG);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProductImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    if (!fromLocation || !toLocation) {
      Toast.show('Please select pickup and destination locations', Toast.LONG);
      return false;
    }
    if (!description.trim()) {
      Toast.show('Please describe what you want to deliver', Toast.LONG);
      return false;
    }
    if (!receiverName.trim()) {
      Toast.show('Please enter receiver name', Toast.LONG);
      return false;
    }
    if (!receiverPhone.trim()) {
      Toast.show('Please enter receiver phone number', Toast.LONG);
      return false;
    }
    return true;
  };

  const handleFindCourier = () => {
    if (!validateForm()) return;

    const formData = {
      noOfPackages: 1,
      weightOfPackages: parseFloat(packageWeight),
      isFragile: fragilePackage,
      description: description.trim(),
      receiver: {
        name: receiverName.trim(),
        phone: receiverPhone.trim()
      },
      productValue: productValue ? parseFloat(productValue) : 0,
      productImage: productImage || 'https://cloudinary.com/imageofproduct',
      offerPrice: parseFloat(offerPrice)
    };

    onFindCourier(formData);
  };

  const truncateAddress = (address: string, maxLength: number = 25) => {
    return address.length > maxLength ? `${address.substring(0, maxLength)}...` : address;
  };

  return (
    <>
      <View style={tw`mb-4`}>
        <Text style={tw`text-2xl font-bold`}>Delivery Details</Text>
        <Text style={tw`text-gray-600 mt-1`}>Fill in the details of your delivery</Text>
      </View>

      <View style={tw`my-4`}>
        <View style={tw`flex-row items-center mb-5`}>
          <View style={tw`h-6 w-6 rounded-full bg-white border-2 border-green-500 items-center justify-center`}>
            <View style={tw`h-3 w-3 rounded-full bg-green-500`}></View>
          </View>
          <Text style={tw`ml-2 text-base font-medium flex-1`}>
            {fromLocation ? truncateAddress(fromLocation.address) : 'Select pickup location'}
          </Text>
        </View>

        <View style={tw`flex-row items-center`}>
          <View style={tw`h-6 w-6 rounded-full bg-white border-2 border-red-500 items-center justify-center`}>
            <View style={tw`h-3 w-3 rounded-full bg-red-500`}></View>
          </View>
          <Text style={tw`ml-2 text-base font-medium flex-1`}>
            {toLocation ? truncateAddress(toLocation.address) : 'Select destination'}
          </Text>
        </View>

        <View style={tw`ml-3 h-12 border-l border-dashed border-orange-500`}></View>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Package weight</Text>
        <View style={tw`flex-row items-center border border-gray-300 rounded-lg bg-white overflow-hidden`}>
          <TextInput
            style={tw`py-3 px-4 text-base flex-1`}
            value={packageWeight}
            onChangeText={setPackageWeight}
            keyboardType="numeric"
          />
          <View style={tw`border-l border-gray-300 h-full flex-row items-center px-3`}>
            <Text style={tw`text-base`}>{weightUnit}</Text>
            <Feather name="chevron-down" size={20} color="black" style={tw`ml-1`} />
          </View>
        </View>
        <Text style={tw`text-xs text-gray-400 mt-1`}>Max Weight 20kg</Text>
      </View>

      <View style={tw`h-px bg-gray-300 my-4`}></View>

      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Text style={tw`text-base font-medium`}>Fragile Package</Text>
        <TouchableOpacity
          style={tw`h-6 w-6 rounded-full ${fragilePackage ? 'bg-orange-500' : 'border border-gray-300 bg-white'}`}
          onPress={() => setFragilePackage(!fragilePackage)}>
          {fragilePackage && (
            <View style={tw`items-center justify-center h-full`}>
              <Feather name="check" size={16} color="white" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={tw`h-px bg-gray-300 my-4`}></View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>What do you want to deliver?*</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg bg-white py-3 px-4 text-base`}
          placeholder="Describe Package"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Receivers Name*</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg bg-white py-3 px-4 text-base`}
          placeholder="Enter Receivers Name"
          placeholderTextColor="#999"
          value={receiverName}
          onChangeText={setReceiverName}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Receivers Phone Number*</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg bg-white py-3 px-4 text-base`}
          placeholder="Enter Receivers Phone Number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          value={receiverPhone}
          onChangeText={setReceiverPhone}
        />
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Product value</Text>
        <TextInput
          style={tw`border border-gray-300 rounded-lg bg-white py-3 px-4 text-base`}
          placeholder="Enter product value"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={productValue}
          onChangeText={setProductValue}
        />
        <Text style={tw`text-xs text-orange-500 mt-1`}>
          Enter product value for safety purposes (Value will not be revealed to courier)
        </Text>
      </View>

      <View style={tw`mb-4`}>
        <Text style={tw`text-gray-600 mb-2`}>Upload Product Image</Text>
        <TouchableOpacity
          style={tw`border border-gray-300 rounded-lg bg-white py-4 px-4 items-center justify-center`}
          onPress={handleImageUpload}>
          <Text style={tw`text-gray-500`}>
            {productImage ? 'Image Selected ✓' : 'Click here to upload image'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={tw`h-px bg-gray-300 my-4`}></View>

      <View style={tw`mb-4`}>
        <View style={tw`bg-red-200 rounded-full px-4 py-2 self-start`}>
          <Text style={tw`text-sm`}>
            Wallet Balance : <Text style={tw`font-bold`}>₦806,000.00</Text>
          </Text>
        </View>
      </View>

      <View style={tw`mb-6`}>
        <Text style={tw`text-gray-600 mb-2`}>Offer your price</Text>
        <View style={tw`border border-gray-300 rounded-lg bg-white py-3 px-4`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-base font-medium mr-1`}>₦</Text>
            <TextInput
              style={tw`text-xl font-bold flex-1`}
              value={offerPrice}
              onChangeText={setOfferPrice}
              keyboardType="numeric"
            />
          </View>
          <Text style={tw`text-xs text-gray-400 mt-1`}>Recommended: 3,000</Text>
        </View>
      </View>

      <TouchableOpacity
        style={tw`bg-orange-500 py-4 rounded-lg items-center justify-center mb-6 ${isLoading ? 'opacity-50' : ''}`}
        onPress={handleFindCourier}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={tw`text-white text-lg font-bold`}>Find Courier</Text>
        )}
      </TouchableOpacity>
    </>
  );
};

export default DeliveryDetails;