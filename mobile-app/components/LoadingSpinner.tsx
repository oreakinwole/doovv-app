import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import tw from 'twrnc';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'large';
}

export function LoadingSpinner({ message = 'Loading...', size = 'large' }: LoadingSpinnerProps) {
    return (
        <View style={tw`flex-1 justify-center items-center p-6`}>
            <ActivityIndicator size={size} color="#3B82F6" />
            <Text style={tw`text-gray-600 mt-4 text-center`}>{message}</Text>
        </View>
    );
}