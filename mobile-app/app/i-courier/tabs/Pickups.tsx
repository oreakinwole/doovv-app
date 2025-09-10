import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Image } from 'react-native';
import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import FullPageModalLayout from '~/layout/FullPageModalLayout';

const pickupsData = [
    {
        id: '1',
        courierName: 'Amaka Rayan',
        rating: 4.8,
        reviewCount: 54,
        distance: '4.9KM',
        timeAway: '11 min',
        pickupLocation: 'Obafemi Awolowo way',
        dropoffLocation: '37A Opebi Road',
        price: '₦ 2,700',
        status: 'Available',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
    },
    {
        id: '2',
        courierName: 'John Adebayo',
        rating: 4.6,
        reviewCount: 87,
        distance: '2.1KM',
        timeAway: '8 min',
        pickupLocation: 'Victoria Island',
        dropoffLocation: 'Lekki Phase 1',
        price: '₦ 3,200',
        status: 'Assigned',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
        id: '3',
        courierName: 'Sarah Okonkwo',
        rating: 4.9,
        reviewCount: 123,
        distance: '6.2KM',
        timeAway: '15 min',
        pickupLocation: 'Ikeja GRA',
        dropoffLocation: 'Maryland Mall',
        price: '₦ 2,100',
        status: 'En Route',
        avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
    }
];

const PickupItem: React.FC<{ item: any; onPress: () => void }> = ({ item, onPress }) => {
    const getStatusStyle = (status: any) => {
        switch (status) {
            case 'Available':
                return {
                    container: tw`bg-[#E8F5E8]`,
                    text: tw`text-green-600`,
                };
            case 'Assigned':
                return {
                    container: tw`bg-[#FFD1C6]`,
                    text: tw`text-[#FF6400]`,
                };
            case 'En Route':
                return {
                    container: tw`bg-blue-100`,
                    text: tw`text-blue-600`,
                };
            default:
                return {
                    container: tw`bg-gray-200`,
                    text: tw`text-gray-800`,
                };
        }
    };

    return (
        <TouchableOpacity
            style={tw`bg-white rounded-xl p-4 mb-4 shadow-sm`}
            onPress={onPress}
        >
            <View style={tw`flex-row items-center mb-4`}>
                <Image
                    source={{ uri: item.avatar }}
                    style={tw`w-12 h-12 rounded-full mr-3`}
                />
                <View style={tw`flex-1`}>
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-lg font-semibold mr-2`}>{item.courierName}</Text>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={tw`text-sm text-gray-600 ml-1`}>
                            {item.rating} ({item.reviewCount})
                        </Text>
                    </View>
                    <Text style={tw`text-sm text-gray-500`}>
                        {item.timeAway}. ({item.distance}) Away
                    </Text>
                </View>
                <View style={[tw`rounded-full px-3 py-1`, getStatusStyle(item.status).container]}>
                    <Text style={[tw`text-xs font-medium`, getStatusStyle(item.status).text]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={tw`flex-row`}>
                <View style={tw`mr-3`}>
                    <View style={tw`items-center`}>
                        <View style={tw`w-4 h-4 rounded-full border-2 border-[#FF6400]`} />
                        <View style={tw`h-12 w-0.5 bg-[#FF6400] my-1`} />
                        <View style={tw`w-4 h-4 rounded-full bg-[#FF6400]`} />
                    </View>
                </View>

                <View style={tw`flex-1 justify-between`}>
                    <Text style={tw`text-base -mt-1`}>{item.pickupLocation}</Text>
                    <Text style={tw`text-base -mb-1`}>{item.dropoffLocation}</Text>
                </View>

                <View style={tw`justify-center items-end`}>
                    <Text style={tw`text-lg font-bold text-[#FF6400] mb-2`}>{item.price}</Text>
                    <Feather name="chevron-right" size={24} color="#FF6400" />
                </View>
            </View>

            <View style={tw`flex-row mt-4 gap-3`}>
                <TouchableOpacity style={tw`flex-1 bg-[#FF6400] py-3 rounded-lg items-center`}>
                    <Text style={tw`text-white font-semibold`}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw`flex-1 bg-black py-3 rounded-lg items-center`}>
                    <Text style={tw`text-white font-semibold`}>Offer Price</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const MyPickupsScreen = () => {
    const [pickupDetail, setPickupDetail] = useState(false);
    const [selectedPickup, setSelectedPickup] = useState<typeof pickupsData[0] | null>(null);

    const getStatusStyle = (status: any) => {
        switch (status) {
            case 'Available':
                return {
                    container: tw`bg-[#E8F5E8]`,
                    text: tw`text-green-600`,
                };
            case 'Assigned':
                return {
                    container: tw`bg-[#FFD1C6]`,
                    text: tw`text-[#FF6400]`,
                };
            case 'En Route':
                return {
                    container: tw`bg-blue-100`,
                    text: tw`text-blue-600`,
                };
            default:
                return {
                    container: tw`bg-gray-200`,
                    text: tw`text-gray-800`,
                };
        }
    };

    const handlePickupPress = (pickup: any) => {
        setSelectedPickup(pickup);
        setPickupDetail(true);
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-100`}>
            <View style={tw`px-4 pt-8 pb-4 flex-row justify-between items-center`}>
                <Text style={tw`text-2xl font-bold`}>Available Pickups</Text>
                <TouchableOpacity style={tw`bg-[#FF6400] px-4 py-2 rounded-lg flex-row items-center`}>
                    <MaterialIcons name="sort" size={16} color="white" />
                    <Text style={tw`text-white font-semibold ml-1`}>Sort</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={pickupsData}
                renderItem={({ item }) => (
                    <PickupItem
                        item={item}
                        onPress={() => handlePickupPress(item)}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={tw`px-4 pt-2 pb-8`}
                showsVerticalScrollIndicator={false}
            />

            <FullPageModalLayout
                modalVisible={pickupDetail}
                setModalVisible={setPickupDetail}
                button={() => setPickupDetail(false)}
                classname={'p-3'}
            >
                {selectedPickup && (
                    <>
                        <View style={tw`flex-row items-center mb-5`}>
                            <Image
                                source={{ uri: selectedPickup.avatar }}
                                style={tw`w-16 h-16 rounded-full mr-4`}
                            />
                            <View style={tw`flex-1`}>
                                <Text style={tw`text-xl font-semibold`}>{selectedPickup.courierName}</Text>
                                <View style={tw`flex-row items-center mt-1`}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={tw`text-gray-600 ml-1`}>
                                        {selectedPickup.rating} ({selectedPickup.reviewCount} reviews)
                                    </Text>
                                </View>
                                <Text style={tw`text-gray-500 mt-1`}>
                                    {selectedPickup.timeAway} away • {selectedPickup.distance}
                                </Text>
                            </View>
                            <View style={[
                                tw`rounded-full px-3 py-1`,
                                getStatusStyle(selectedPickup.status).container
                            ]}>
                                <Text style={[tw`font-medium`, getStatusStyle(selectedPickup.status).text]}>
                                    {selectedPickup.status}
                                </Text>
                            </View>
                        </View>

                        <Image source={require('../../../assets/miniMap.png')} style={tw`w-full h-50 rounded-xl shadow-xl border border-[#9E9392]`} />
                        
                        <View style={tw`px-5 pt-4`}>
                            <View style={tw`flex-row items-start`}>
                                <View style={tw`mr-3 items-center`}>
                                    <View style={tw`w-3 h-3 rounded-full border-2 border-orange-500`} />
                                    <View style={tw`h-12 w-0.5 bg-orange-200 my-1`} />
                                    <View style={tw`w-3 h-3 rounded-full border-2 border-orange-500`} />
                                </View>

                                <View style={tw`flex-1 mt-[-4px]`}>
                                    <Text style={tw`text-base text-gray-800`}>{selectedPickup.pickupLocation}</Text>
                                    <View style={tw`h-10`} />
                                    <Text style={tw`text-base text-gray-800`}>{selectedPickup.dropoffLocation}</Text>
                                </View>

                                <View style={tw`items-end mt-[-4px]`}>
                                    <Text style={tw`text-xl font-bold text-[#FF6400]`}>{selectedPickup.price}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={tw`h-0.5 bg-gray-200 mt-5`} />

                        <View style={tw`flex-row items-center px-5 py-4 justify-between`}>
                            <View style={tw`flex-row items-center`}>
                                <Image
                                    source={{ uri: selectedPickup.avatar }}
                                    style={tw`w-12 h-12 rounded-full`}
                                />
                                <View style={tw`ml-3`}>
                                    <Text style={tw`text-lg font-semibold`}>{selectedPickup.courierName}</Text>
                                    <Text style={tw`text-gray-500`}>Available for pickup</Text>
                                </View>
                            </View>

                            <View style={tw`flex-row`}>
                                <TouchableOpacity style={tw`mr-5`}>
                                    <Ionicons name="chatbubble-outline" size={24} color="#333" />
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Ionicons name="call-outline" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={tw`h-0.5 bg-gray-200`} />

                        <View style={tw`flex-row justify-around py-4`}>
                            <TouchableOpacity style={tw`items-center`}>
                                <View style={tw`bg-[#FFDCD7] w-12 h-12 rounded-full items-center justify-center`}>
                                    <FontAwesome name="question" size={20} color="#666" />
                                </View>
                                <Text style={tw`mt-1 text-sm`}>Support</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={tw`items-center`}>
                                <View style={tw`bg-[#FFDCD7] w-12 h-12 rounded-full items-center justify-center`}>
                                    <MaterialIcons name="schedule" size={22} color="#666" />
                                </View>
                                <Text style={tw`mt-1 text-sm`}>Schedule</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={tw`items-center`}>
                                <View style={tw`bg-[#FFDCD7] w-12 h-12 rounded-full items-center justify-center`}>
                                    <MaterialIcons name="share" size={22} color="#666" />
                                </View>
                                <Text style={tw`mt-1 text-sm`}>Share</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={tw`h-0.5 bg-gray-200`} />

                        <View style={tw`flex-row gap-3 px-5 py-4`}>
                            <TouchableOpacity style={tw`flex-1 bg-[#FF6400] py-4 rounded-lg items-center`}>
                                <Text style={tw`text-white font-semibold text-lg`}>Accept Pickup</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`flex-1 bg-black py-4 rounded-lg items-center`}>
                                <Text style={tw`text-white font-semibold text-lg`}>Counter Offer</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </FullPageModalLayout>
        </SafeAreaView>
    );
};

export default MyPickupsScreen;