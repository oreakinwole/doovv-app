// components/ProfileHeader.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import tw from 'twrnc';


interface User {
    [key: string]: any;
}

const ProfileHeader: React.FC<{ user: User | null }> = ({ user }) => {
    return (
        <View style={tw`items-center mb-6`}>
            <Image
                source={require('~/assets/profile-image.png')}
                style={tw`w-28 h-28 rounded-full`}
            />

            <Text style={tw`text-2xl font-bold mt-4`}>{user?.account.fullname}</Text>

            <View style={tw`flex-row items-center mt-1`}>
                <FontAwesome name="star" size={21} color="#FFC107" style={tw`mr-2`} />
                <Text style={tw`text-lg font-bold`}>4.5</Text>
                <Text style={tw`text-lg text-gray-600 ml-2`}>Rating</Text>
            </View>
        </View>
    );
};

export default ProfileHeader;