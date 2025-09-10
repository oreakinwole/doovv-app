import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView, Modal, Image } from 'react-native';
import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import tw from 'twrnc';
import FullPageModalLayout from '~/layout/FullPageModalLayout';
import { deliveriesData } from '~/db/deliveries';

const DeliveryItem: React.FC<{ item: any; onPress: () => void }> = ({ item, onPress }) => {
    // Function to determine the style for the status badge
    const getStatusStyle = (status: any) => {
        switch (status) {
            case 'In progress':
                return {
                    container: tw`bg-[#FFD1C6]`,
                    text: tw`text-[#FF6400]`,
                };
            case 'Delivered':
                return {
                    container: tw`bg-[#FF6400]`,
                    text: tw`text-white`,
                };
            case 'You Cancelled':
            case 'Courier Cancelled':
                return {
                    container: tw`bg-gray-400`,
                    text: tw`text-white`,
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
            <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-base font-medium`}>{item.date}</Text>
                <Text style={tw`text-base font-medium`}>{item.amount}</Text>
            </View>

            <View style={tw`flex-row`}>
                {/* Route indicators */}
                <View style={tw`mr-3`}>
                    <View style={tw`items-center`}>
                        <View style={tw`w-4 h-4 rounded-full border-2 border-[#FF6400]`} />
                        <View style={tw`h-12 w-0.5 bg-[#FF6400] my-1`} />
                        <View style={tw`w-4 h-4 rounded-full bg-[#FF6400]`} />
                    </View>
                </View>

                {/* Locations */}
                <View style={tw`flex-1 justify-between`}>
                    <Text style={tw`text-base -mt-1`}>{item.pickupLocation}</Text>
                    <Text style={tw`text-base -mb-1`}>{item.dropoffLocation}</Text>
                </View>

                {/* Arrow */}
                <View style={tw`justify-center`}>
                    <Feather name="chevron-right" size={24} color="#FF6400" />
                </View>
            </View>

            {/* Status badge */}
            <View style={tw`mt-4`}>
                <View style={[tw`self-start rounded-full px-4 py-1`, getStatusStyle(item.status).container]}>
                    <Text style={[tw`font-medium`, getStatusStyle(item.status).text]}>
                        {item.status}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const MyDeliveriesScreen = () => {
    const [deliveryDetail, setDeliveryDetail] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState<typeof deliveriesData[0] | null>(null);

    const getStatusStyle = (status: any) => {
        switch (status) {
            case 'In progress':
                return {
                    container: tw`bg-[#FFD1C6]`,
                    text: tw`text-[#FF6400]`,
                };
            case 'Delivered':
                return {
                    container: tw`bg-[#FF6400]`,
                    text: tw`text-white`,
                };
            case 'You Cancelled':
            case 'Courier Cancelled':
                return {
                    container: tw`bg-gray-400`,
                    text: tw`text-white`,
                };
            default:
                return {
                    container: tw`bg-gray-200`,
                    text: tw`text-gray-800`,
                };
        }
    };

    const handleDeliveryPress = (delivery: any) => {
        setSelectedDelivery(delivery);
        setDeliveryDetail(true);
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-100`}>
            <View style={tw`px-4 pt-8 pb-4`}>
                <Text style={tw`text-2xl font-bold`}>My Deliveries</Text>
            </View>

            <FlatList
                data={deliveriesData}
                renderItem={({ item }) => (
                    <DeliveryItem
                        item={item}
                        onPress={() => handleDeliveryPress(item)}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={tw`px-4 pt-2 pb-8`}
                showsVerticalScrollIndicator={false}
            />

            <FullPageModalLayout
                modalVisible={deliveryDetail}
                setModalVisible={setDeliveryDetail}
                button={() => setDeliveryDetail(false)}
                classname={'p-3'}
            >
                {selectedDelivery && (
                    <>
                        <Text style={tw`my-5 text-xl font-semibold`}>Tue, 18 Mar 2025</Text>
                        <Image source={require('../../../assets/miniMap.png')} style={tw`w-full h-50 rounded-xl shadow-xl border border-[#9E9392]`} />
                        <View style={tw`px-5 pt-4`}>
                            <View style={tw`flex-row items-start`}>
                                <View style={tw`mr-3 items-center`}>
                                    <View style={tw`w-3 h-3 rounded-full border-2 border-orange-500`} />
                                    <View style={tw`h-12 w-0.5 bg-orange-200 my-1`} />
                                    <View style={tw`w-3 h-3 rounded-full border-2 border-orange-500`} />
                                </View>

                                <View style={tw`flex-1 mt-[-4px]`}>
                                    <Text style={tw`text-base text-gray-800`}>{selectedDelivery.pickupLocation}</Text>
                                    <View style={tw`h-10`} />
                                    <Text style={tw`text-base text-gray-800`}>{selectedDelivery.dropoffLocation}</Text>
                                </View>
                            </View>

                            {/* Status Badge */}
                            <View style={tw`flex-row mt-4`}>
                                <View style={[
                                    tw`rounded-full px-4 py-1`,
                                    getStatusStyle(selectedDelivery.status).container
                                ]}>
                                    <Text style={getStatusStyle(selectedDelivery.status).text}>
                                        {selectedDelivery.status}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Divider */}
                        <View style={tw`h-0.5 bg-gray-200 mt-5`} />

                        {/* Driver Info */}
                        <View style={tw`flex-row items-center px-5 py-4 justify-between`}>
                            <View style={tw`flex-row items-center`}>
                                <Image
                                    source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                                    style={tw`w-12 h-12 rounded-full`}
                                />
                                <View style={tw`ml-3`}>
                                    <Text style={tw`text-lg font-semibold`}>Josh Ayinde</Text>
                                    <Text style={tw`text-gray-500`}>Car (Toyota Corolla)</Text>
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

                        {/* Divider */}
                        <View style={tw`h-0.5 bg-gray-200`} />

                        {/* Actions */}
                        <View style={tw`flex-row justify-around py-4`}>
                            <TouchableOpacity style={tw`items-center`}>
                                <View style={tw`bg-[#FFDCD7] w-12 h-12 rounded-full items-center justify-center`}>
                                    <FontAwesome name="question" size={20} color="#666" />
                                </View>
                                <Text style={tw`mt-1 text-sm`}>Support</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={tw`items-center`}>
                                <View style={tw`bg-[#FFDCD7] w-12 h-12 rounded-full items-center justify-center`}>
                                    <Ionicons name="refresh" size={22} color="#666" />
                                </View>
                                <Text style={tw`mt-1 text-sm`}>Repeat</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={tw`items-center`}>
                                <View style={tw`bg-[#FFDCD7] w-12 h-12 rounded-full items-center justify-center`}>
                                    <MaterialIcons name="keyboard-return" size={22} color="#666" />
                                </View>
                                <Text style={tw`mt-1 text-sm`}>Return Route</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Divider */}
                        <View style={tw`h-0.5 bg-gray-200`} />

                        {/* Payment */}
                        <View style={tw`flex-row items-center justify-between px-5 py-4`}>
                            <View style={tw`bg-gray-300 px-4 py-1 rounded-full`}>
                                <Text style={tw`text-gray-700`}>Unpaid</Text>
                            </View>

                            <Text style={tw`text-lg font-bold`}>{selectedDelivery.amount}</Text>
                        </View>
                    </>
                )}
            </FullPageModalLayout>
        </SafeAreaView>
    );
};

export default MyDeliveriesScreen;