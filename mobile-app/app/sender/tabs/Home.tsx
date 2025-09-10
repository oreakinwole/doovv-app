import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import CustomButton from '~/components/Button';
import LayoutPage from '~/layout/PageLayout';
import FullPageModalLayout from '~/layout/FullPageModalLayout';
import { MapIcon } from '~/assets/svgs';
import BottomCard from '~/components/Sender/BottomCard';
import LocationCardContent from '~/components/Sender/LocationCardContent';
import DeliveryDetails from '~/components/Sender/DeliveryDetails';
import SearchingCouriersContent from '~/components/Sender/SearchingCouriersContent';
import LocationInput from '~/components/LocationInput';
import { requests } from '~/api/requests';
import { LocationCoordinates, LocationService, PlaceSuggestion } from '~/services/locationService';
import CourierFoundContent from '~/components/Sender/CourierFoundContent';
import { CourierData } from '~/types';
import { MapSim } from '~/components/MapSim';
import Toast from 'react-native-toast-message';
import Map from '~/components/Map';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

interface DeliveryData {
  from: Location;
  to: Location;
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

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deliveryPackageModal, setDeliveryPackageModal] = useState(false);
  const [showSearching, setShowSearching] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(2700);
  const [deliveryData, setDeliveryData] = useState<DeliveryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const [fromLocation, setFromLocation] = useState<LocationCoordinates | null>(null);
  const [toLocation, setToLocation] = useState<LocationCoordinates | null>(null);
  const [activeInput, setActiveInput] = useState<'from' | 'to'>('from');

  const [courierFound, setCourierFound] = useState(false);
  const [courierData, setCourierData] = useState<CourierData>();

  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [sessionToken] = useState(() => LocationService.generateSessionToken());
  const debounceRef = useRef<NodeJS.Timeout>();

  // Handle current location found from Map component
  const handleCurrentLocationFound = useCallback(async (location: { latitude: number; longitude: number; address: string }) => {
    // Automatically set as "from" location if not already set
    if (!fromLocation) {
      const locationCoordinates = LocationService.createLocationCoordinates(
        location.latitude,
        location.longitude,
        location.address
      );
      setFromLocation(locationCoordinates);
    }
  }, [fromLocation]);

  // Manual current location handler for buttons
  const handleUseCurrentLocation = useCallback(async () => {
    setIsGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Location permission is required',
          position: 'top'
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // Use LocationService to get proper LocationCoordinates
      const locationCoordinates = await LocationService.getCurrentLocationCoordinates(latitude, longitude);

      if (locationCoordinates) {
        // Set based on which input is active
        if (activeInput === 'from') {
          setFromLocation(locationCoordinates);
          // If destination is already set, close modal, otherwise switch to destination input
          if (toLocation) {
            setModalVisible(false);
          } else {
            setActiveInput('to');
          }
        } else {
          setToLocation(locationCoordinates);
          // If pickup is already set, close modal, otherwise switch to pickup input
          if (fromLocation) {
            setModalVisible(false);
          } else {
            setActiveInput('from');
          }
        }

        Toast.show({
          type: 'success',
          text1: 'Current location set successfully',
          position: 'top'
        });
      } else {
        // Fallback if reverse geocoding fails
        const fallbackAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        const fallbackLocation = LocationService.createLocationCoordinates(
          latitude,
          longitude,
          fallbackAddress
        );

        if (activeInput === 'from') {
          setFromLocation(fallbackLocation);
          if (toLocation) {
            setModalVisible(false);
          } else {
            setActiveInput('to');
          }
        } else {
          setToLocation(fallbackLocation);
          if (fromLocation) {
            setModalVisible(false);
          } else {
            setActiveInput('from');
          }
        }

        Toast.show({
          type: 'success',
          text1: 'Current location set (coordinates only)',
          position: 'top'
        });
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      Toast.show({
        type: 'error',
        text1: 'Unable to get current location',
        position: 'top'
      });
    } finally {
      setIsGettingLocation(false);
    }
  }, [activeInput, fromLocation, toLocation]);

  const handleLocationSearch = useCallback(async (text: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (text.length >= 2) {
        setIsSuggestionsLoading(true);

        try {
          const results = await LocationService.getPlaceSuggestions(text, sessionToken);
          setSuggestions(results);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsSuggestionsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsSuggestionsLoading(false);
      }
    }, 300);
  }, [sessionToken]);

  const staticMarkers = useMemo(() => [
    { latitude: 6.5244, longitude: 3.3792, title: 'Marker 1', description: 'Lagos' },
    { latitude: 6.53, longitude: 3.375, title: 'Marker 2', description: 'Somewhere else' },
  ], []);

  const handleDecreaseOffer = useCallback(() => {
    const newOffer = Math.max(currentOffer - 100, 0);
    setCurrentOffer(newOffer);
    if (deliveryData) {
      updateOfferPrice(newOffer);
    }
  }, [currentOffer, deliveryData]);

  const handleIncreaseOffer = useCallback(() => {
    const newOffer = currentOffer + 100;
    setCurrentOffer(newOffer);
    if (deliveryData) {
      updateOfferPrice(newOffer);
    }
  }, [currentOffer, deliveryData]);

  const updateOfferPrice = async (newPrice: number) => {
    if (!deliveryData?.deliveryId) return;

    try {
      console.log('Updating offer to:', newPrice);
    } catch (error) {
      console.error('Error updating offer:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to update offer price',
        position: 'top'
      });
    }
  };

  const closeLocationModal = useCallback(() => {
    setModalVisible(false);
    setSuggestions([]);
  }, []);

  const handleSuggestionPress = useCallback(async (suggestion: PlaceSuggestion) => {
    setIsSuggestionsLoading(true);

    try {
      const locationDetails = await LocationService.getPlaceDetails(suggestion.place_id);
      if (locationDetails) {
        if (activeInput === 'from') {
          setFromLocation(locationDetails);
          // If destination is already set, close modal, otherwise switch to destination input
          if (toLocation) {
            setSuggestions([]);
            setModalVisible(false);
          } else {
            // Switch to destination input
            setActiveInput('to');
            setSuggestions([]); // Clear suggestions for new input
          }
        } else {
          setToLocation(locationDetails);
          // If pickup is already set, close modal, otherwise switch to pickup input
          if (fromLocation) {
            setSuggestions([]);
            setModalVisible(false);
          } else {
            // Switch to pickup input
            setActiveInput('from');
            setSuggestions([]); // Clear suggestions for new input
          }
        }
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    } finally {
      setIsSuggestionsLoading(false);
    }
  }, [activeInput, fromLocation, toLocation]);

  const clearLocation = useCallback((inputType: 'from' | 'to') => {
    if (inputType === 'from') {
      setFromLocation(null);
    } else {
      setToLocation(null);
    }
  }, []);

  const handleFindCourier = async (formData: any) => {
    if (!fromLocation || !toLocation) {
      Toast.show({
        type: 'error',
        text1: 'Please select both pickup and destination locations',
        position: 'top'
      });
      return;
    }

    setIsLoading(true);

    try {
      const deliveryPayload = {
        ...formData,
        from: {
          address: fromLocation.address,
          latitude: fromLocation.latitude,
          longitude: fromLocation.longitude,
        },
        to: {
          address: toLocation.address,
          latitude: toLocation.latitude,
          longitude: toLocation.longitude,
        },
      };

      const response = await requests.initDelivery(deliveryPayload);

      if (response.data.status === 'success') {
        setDeliveryData(response.data.data);
        setCurrentOffer(response.data.data.offerPrice);
        setDeliveryPackageModal(false);
        setShowSearching(true);
      } else {
        Toast.show({
          type: 'error',
          text1: response.data.message || 'Failed to create delivery request',
          position: 'top'
        });
      }
    } catch (error: any) {
      console.error('Error creating delivery:', error);
      const errorMessage = error.response?.data?.message || 'Network error. Please try again.';
      Toast.show({
        type: 'error',
        text1: errorMessage,
        position: 'top'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = !!(fromLocation && toLocation);

  const handleChat = useCallback(() => {
    console.log('Opening chat...');
  }, []);

  const handleCall = useCallback(() => {
    console.log('Making call...');
  }, []);

  const handleCancelDelivery = useCallback(() => {
    setShowSearching(false);
    setCourierFound(false);
    setCourierData(undefined);
    setDeliveryData(null);
    setCurrentOffer(2700);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsMounted(false);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <LayoutPage noscroll>
      <Map
        isActive={isMounted && !showSearching && !courierFound}
        fromLocation={fromLocation}
        toLocation={toLocation}
        markers={staticMarkers}
      // onCurrentLocationFound={handleCurrentLocationFound}
      />

      <BottomCard>
        {!showSearching && !courierFound ? (
          <LocationCardContent
            fromLocation={fromLocation}
            toLocation={toLocation}
            onSendPackage={() => {
              if (canProceed) {
                setDeliveryPackageModal(true);
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Please select both pickup and destination locations',
                  position: 'top'
                });
              }
            }}
            onEditLocation={(inputType: 'from' | 'to') => {
              setActiveInput(inputType);
              setModalVisible(true);
            }}
            canProceed={canProceed}
          />
        ) : showSearching && !courierFound ? (
          <SearchingCouriersContent
            currentOffer={currentOffer}
            onDecreaseOffer={handleDecreaseOffer}
            onIncreaseOffer={handleIncreaseOffer}
            onCancelSearch={handleCancelDelivery}
            deliveryData={deliveryData}
          />
        ) : (
          <CourierFoundContent
            courier={courierData}
            deliveryData={deliveryData}
            onChat={handleChat}
            onCall={handleCall}
            onCancel={handleCancelDelivery}
          />
        )}
      </BottomCard>

      {/* Location Selection Modal */}
      <FullPageModalLayout
        modalVisible={modalVisible}
        setModalVisible={closeLocationModal}
        button={closeLocationModal}
        classname={'p-2'}
        showBackButton={true}
        onBackPress={closeLocationModal}
      >
        {/* Current Location Button */}

        <View style={tw`mx-2 my-2`}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-center py-3 px-4 ${activeInput === 'to'
                ? 'bg-gray-100 border border-gray-300'
                : 'bg-orange-50 border border-orange-200'
              } rounded-lg mb-4`}
            onPress={handleUseCurrentLocation}
            disabled={isGettingLocation || activeInput === 'to'}
          >
            {isGettingLocation ? (
              <ActivityIndicator size="small" color="#FF6B37" style={tw`mr-2`} />
            ) : (
              <Ionicons
                name="location"
                size={20}
                color={activeInput === 'to' ? "#9CA3AF" : "#FF6B37"}
                style={tw`mr-2`}
              />
            )}
            <Text style={tw`${activeInput === 'to'
                ? 'text-gray-400'
                : 'text-orange-600'
              } font-medium text-base`}>
              {activeInput === 'to'
                ? 'Use Current Location'
                : isGettingLocation
                  ? 'Getting location...'
                  : 'Use Current Location'
              }
            </Text>
          </TouchableOpacity>
        </View>

        {/* From Location Input */}
        <View style={tw`mx-2 my-2`}>
          <Text style={tw`text-gray-700 font-medium mb-2`}>
            {activeInput === 'from' ? 'Pickup Location' : 'From'}
          </Text>
          <LocationInput
            placeholder="Enter pickup location"
            value={activeInput === 'from' ? (fromLocation?.address || '') : (fromLocation?.address || 'Tap to set pickup location')}
            onLocationSelect={() => { }}
            onSearch={activeInput === 'from' ? handleLocationSearch : () => { }}
            onClear={() => clearLocation('from')}
            onFocus={() => setActiveInput('from')}
            icon="location-on"
            iconColor="#FF6B37"
            editable={activeInput === 'from'}
          />
        </View>

        {/* To Location Input */}
        <View style={tw`mx-2 my-2 flex-row items-center justify-between`}>
          <View style={tw`flex-1 mr-2`}>
            <Text style={tw`text-gray-700 font-medium mb-2`}>
              {activeInput === 'to' ? 'Destination' : 'To'}
            </Text>
            <LocationInput
              placeholder="Enter destination"
              value={activeInput === 'to' ? (toLocation?.address || '') : (toLocation?.address || 'Tap to set destination')}
              onLocationSelect={() => { }}
              onSearch={activeInput === 'to' ? handleLocationSearch : () => { }}
              onClear={() => clearLocation('to')}
              onFocus={() => setActiveInput('to')}
              icon="search"
              editable={activeInput === 'to'}
              autoFocus={activeInput === 'to'} // Add this line
            />
          </View>
        </View>

        {/* Active Input Indicator */}
        {/* <View style={tw`mx-2 mb-4`}>
          <Text style={tw`text-sm text-gray-500 text-center`}>
            {activeInput === 'from' 
              ? 'Setting pickup location...' 
              : 'Setting destination...'}
          </Text>
        </View> */}

        {/* Suggestions List */}
        <ScrollView style={tw`mt-4 flex-1`}>
          {isSuggestionsLoading ? (
            <View style={tw`items-center py-8`}>
              <ActivityIndicator size="large" color="#FF6B37" />
              <Text style={tw`text-gray-500 mt-2`}>Searching locations...</Text>
            </View>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <React.Fragment key={suggestion.place_id}>
                <TouchableOpacity
                  style={tw`flex-row items-center px-4 py-3 active:bg-gray-50`}
                  onPress={() => handleSuggestionPress(suggestion)}
                >
                  <View style={tw`h-8 w-8 rounded-full bg-gray-200 items-center justify-center`}>
                    <Ionicons name="location-outline" size={18} color="#666" />
                  </View>
                  <View style={tw`ml-3 flex-1`}>
                    <Text style={tw`text-base font-medium text-gray-900`}>{suggestion.main_text}</Text>
                    {suggestion.secondary_text && (
                      <Text style={tw`text-sm text-gray-600 mt-1`}>{suggestion.secondary_text}</Text>
                    )}
                  </View>
                </TouchableOpacity>
                {index < suggestions.length - 1 && <View style={tw`h-px bg-gray-200 mx-4`} />}
              </React.Fragment>
            ))
          ) : (
            null
            // <View style={tw`items-center py-8`}>
            //   <Ionicons name="search-outline" size={48} color="#ccc" />
            //   <Text style={tw`text-gray-500 mt-2 text-center px-4`}>
            //     {activeInput === 'from' 
            //       ? 'Type to search for pickup location or use current location'
            //       : 'Type to search for destination'}
            //   </Text>
            // </View>
          )}
        </ScrollView>

        {/* Done Button */}
        {fromLocation && toLocation && (
          <View style={tw`mx-2 mt-4 mb-2`}>
            <CustomButton
              variant='solid'
              label="Next"
              onPress={closeLocationModal}
            // backgroundColor="#FF6B37"
            // textColor="#fff"
            />
          </View>
        )}
      </FullPageModalLayout>

      {/* Delivery Package Modal */}
      <FullPageModalLayout
        modalVisible={deliveryPackageModal}
        setModalVisible={setDeliveryPackageModal}
        button={() => setDeliveryPackageModal(false)}
        classname={'p-4'}
        showBackButton={true}
        onBackPress={() => setDeliveryPackageModal(false)}
      >
        <DeliveryDetails
          onFindCourier={handleFindCourier}
          isLoading={isLoading}
          fromLocation={fromLocation}
          toLocation={toLocation}
        />
      </FullPageModalLayout>
    </LayoutPage>
  );
};

export default Home;