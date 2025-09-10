import React, { ReactNode, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { router } from 'expo-router';

interface LayoutPageProps {
    pageLabel?: string;
    children: ReactNode;
    classname?: any;
    noscroll?: boolean;
    customBackFunction?: () => void;
}
const LayoutPage: React.FC<LayoutPageProps> = ({ pageLabel, children, classname, noscroll = false, customBackFunction }) => {

    return (
        noscroll ?
            <View style={tw`flex-1 bg-[#F3F3F4] ${classname}`}>
                {children}
            </View>
            :
            <ScrollView style={tw`flex-1 bg-[#F3F3F4] ${classname}`} overScrollMode='never'>
                {children}
            </ScrollView>
    );
};

export default LayoutPage;