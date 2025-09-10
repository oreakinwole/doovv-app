import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import tw from 'twrnc';
import LayoutPage from '~/layout/PageLayout';
import CustomButton from '~/components/Button';
import { router } from 'expo-router';
import FullPageModalLayout from '~/layout/FullPageModalLayout';
import { BuildingImg, PackageImg, VehicleImg } from '~/assets/svgs/image';
import { SelectionCard } from '~/components/SelectionCard';
import { useAuth } from '~/context/AuthContext';
import { requests } from '~/api/requests';

const ICourierAccount = () => {
    const [personalInfo, setPersonalInfo] = useState(false);
    const [switchRole, setSwitchRole] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const { logout, user: userData } = useAuth();

    useEffect(() => {
        // console.log('ICourierAccount userData:', userData);
    });

    const getFullName = () => {
        if (!userData?.account) return '';
        const { firstname, middlename, lastname } = userData.account;
        return [firstname, middlename, lastname].filter(Boolean).join(' ');
    };

    const getProfileImageUri = () => {
        return profileImage || userData?.account?.imageUrl || null;
    };

    const pickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Toast.show({
                    type: 'error',
                    text1: 'Sorry, we need camera roll permissions to make this work!',
                    position: 'top'
                });
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets?.[0]) {
                uploadProfileImage(result.assets[0]);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to pick image. Please try again.',
                position: 'top'
            });
        }
    };

    const uploadProfileImage = async (imageAsset: ImagePicker.ImagePickerAsset) => {
        if (!imageAsset?.uri) return;
        
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', {
                uri: imageAsset.uri,
                type: imageAsset.mimeType || 'image/jpeg',
                name: 'profile-image.jpg',
            } as any);

            const response = await requests.uploadProfileImage(formData);

            if (response?.data?.status === 'success') {
                setProfileImage(response.data.data.imageUrl);
                Toast.show({
                    type: 'success',
                    text1: response.data.message,
                    position: 'top'
                });
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Error uploading profile image:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to upload profile image. Please try again.',
                position: 'top'
            });
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <LayoutPage noscroll={true} classname={'p-4 pt-[13%]'}>
            <View style={tw`items-center mt-8 mb-6`}>
                {getProfileImageUri() ? (
                    <Image
                        source={{ uri: getProfileImageUri() }}
                        style={tw`w-28 h-28 rounded-full`}
                    />
                ) : (
                    <View style={tw`w-28 h-28 rounded-full bg-gray-300 items-center justify-center`}>
                        <Feather name="user" size={40} color="#666" />
                    </View>
                )}
                <Text style={tw`text-2xl font-bold mt-4`}>{getFullName()}</Text>

                <View style={tw`flex-row items-center mt-1`}>
                    <FontAwesome name="star" size={21} color="#FFC107" style={tw`mr-2`} />
                    <Text style={tw`text-lg font-bold`}>
                        {userData?.courier?.averageRating || 'No rating'}
                    </Text>
                    <Text style={tw`text-lg text-gray-600 ml-2`}>
                        ({userData?.courier?.ratingCount || 0} reviews)
                    </Text>
                </View>
            </View>

            <View style={tw`mt-5 flex-1`}>
                <TouchableOpacity
                    style={tw`flex-row items-center justify-between py-4`}
                    onPress={() => setPersonalInfo(true)}
                >
                    <View style={tw`flex-row items-center`}>
                        <Feather name="user" size={24} color="black" style={tw`mr-4`} />
                        <Text style={tw`text-lg`}>Personal Info</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="black" />
                </TouchableOpacity>

                <View style={tw`h-px bg-gray-200 my-2`}></View>

                <TouchableOpacity
                    style={tw`flex-row items-center justify-between py-4`}
                    onPress={() => {}}
                >
                    <View style={tw`flex-row items-center`}>
                        <MaterialIcons name="directions-car" size={24} color="black" style={tw`mr-4`} />
                        <Text style={tw`text-lg`}>Vehicle Info</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color="black" />
                </TouchableOpacity>

                <View style={tw`h-px bg-gray-200 my-2`}></View>

                <TouchableOpacity
                    style={tw`flex-row items-center justify-between py-4`}
                    onPress={() => {}}
                >
                    <View style={tw`flex-row items-center`}>
                        <MaterialIcons name="security" size={24} color="black" style={tw`mr-4`} />
                        <Text style={tw`text-lg`}>Guarantor</Text>
                    </View>
                    <View style={tw`flex-row items-center`}>
                        <Text style={tw`text-green-500 text-sm mr-2`}>2/2 Registered</Text>
                        <Feather name="chevron-right" size={24} color="black" />
                    </View>
                </TouchableOpacity>

                <View style={tw`h-px bg-gray-200 my-2`}></View>

                <TouchableOpacity
                    style={tw`flex-row items-center justify-between py-4`}
                    onPress={logout}
                >
                    <View style={tw`flex-row items-center`}>
                        <Feather name="log-out" size={24} color="black" style={tw`mr-4`} />
                        <Text style={tw`text-lg`}>Logout</Text>
                    </View>
                </TouchableOpacity>

                <View style={tw`h-px bg-gray-200 my-2`}></View>
            </View>

            <FullPageModalLayout modalVisible={personalInfo} setModalVisible={setPersonalInfo} button={() => setPersonalInfo(false)}>
                <View style={tw`items-center mt-2 mb-8`}>
                    <View style={tw`relative`}>
                        {getProfileImageUri() ? (
                            <Image
                                source={{ uri: getProfileImageUri() }}
                                style={tw`w-28 h-28 rounded-full`}
                            />
                        ) : (
                            <View style={tw`w-28 h-28 rounded-full bg-gray-300 items-center justify-center`}>
                                <Feather name="user" size={40} color="#666" />
                            </View>
                        )}
                        <TouchableOpacity
                            style={tw`absolute top-0 right-0 bg-[#F26933] w-8 h-8 rounded-full items-center justify-center`}
                            onPress={pickImage}
                            disabled={uploading}
                        >
                            <Feather name="plus" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={pickImage} disabled={uploading}>
                        <Text style={tw`text-[#F26933] text-center mt-3 font-medium`}>
                            {uploading ? 'Uploading...' : 'Edit Profile Photo'}
                        </Text>
                    </TouchableOpacity>

                    <Text style={tw`text-gray-500 text-center mt-2 mx-8`}>
                        Add a profile picture to your account so couriers can recognize you
                    </Text>
                </View>

                <View style={tw`px-4`}>
                    <View style={tw`flex-row items-center py-4 border-b border-gray-200`}>
                        <Feather name="user" size={20} color="black" style={tw`mr-4`} />
                        <Text style={tw`text-lg font-medium`}>{getFullName()}</Text>
                    </View>

                    <View style={tw`flex-row items-center py-4 border-b border-gray-200`}>
                        <Feather name="smartphone" size={20} color="black" style={tw`mr-4`} />
                        <Text style={tw`text-lg font-medium`}>{userData?.account?.phone}</Text>
                    </View>

                    <View style={tw`flex-row items-center py-4 border-b border-gray-200`}>
                        <MaterialIcons name="email" size={20} color="black" style={tw`mr-4`} />
                        <Text style={tw`text-lg font-medium`}>{userData?.account?.email}</Text>
                    </View>

                    <View style={tw`flex-row items-center py-4 border-b border-gray-200`}>
                        <MaterialIcons name="credit-card" size={20} color="black" style={tw`mr-4`} />
                        <View>
                            <Text style={tw`text-lg font-medium`}>NIN</Text>
                            <Text style={tw`text-sm text-gray-500`}>{userData?.account?.nin || 'Not provided'}</Text>
                        </View>
                    </View>

                    <View style={tw`flex-row items-center py-4 border-b border-gray-200`}>
                        <MaterialIcons name="account-balance" size={20} color="black" style={tw`mr-4`} />
                        <View>
                            <Text style={tw`text-lg font-medium`}>BVN</Text>
                            <Text style={tw`text-sm text-gray-500`}>{userData?.account?.bvn || 'Not provided'}</Text>
                        </View>
                    </View>

                    <View style={tw`flex-row items-center py-4 border-b border-gray-200`}>
                        <MaterialIcons name="location-on" size={20} color="black" style={tw`mr-4`} />
                        <View>
                            <Text style={tw`text-lg font-medium`}>Address</Text>
                            <Text style={tw`text-sm text-gray-500`}>{userData?.courier?.address || 'Not provided'}</Text>
                        </View>
                    </View>

                    <View style={tw`flex-row items-center py-4 border-b border-gray-200`}>
                        <MaterialIcons name="directions-bike" size={20} color="black" style={tw`mr-4`} />
                        <View>
                            <Text style={tw`text-lg font-medium`}>Means of Travel</Text>
                            <Text style={tw`text-sm text-gray-500 capitalize`}>{userData?.courier?.meansOfTravel || 'Not specified'}</Text>
                        </View>
                    </View>
                </View>
            </FullPageModalLayout>

            <FullPageModalLayout modalVisible={switchRole} setModalVisible={setSwitchRole} button={() => setSwitchRole(false)}>
                <View style={tw`p-4`}>
                    <Text style={tw`text-xl font-bold mb-2`}>Switch Your Role</Text>
                    <Text style={tw`text-gray-500 mb-5`}>You can switch later if needed.</Text>
                    <SelectionCard
                        description='Earn by delivering packages along your route.'
                        icon={<VehicleImg />}
                        handleClick={() => {}}
                        title='Individual Courier'
                    />
                    <SelectionCard
                        description='Manage a fleet and handle bulk deliveries.'
                        icon={<BuildingImg />}
                        handleClick={() => {}}
                        title='Business Courier'
                    />
                </View>
            </FullPageModalLayout>
        </LayoutPage>
    )
}

export default ICourierAccount