import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface RetryButtonProps {
    onRetry: () => void;
    isLoading?: boolean;
    title?: string;
    variant?: 'primary' | 'secondary';
}

export function RetryButton({
    onRetry,
    isLoading = false,
    title = 'Try Again',
    variant = 'primary'
}: RetryButtonProps) {
    const baseStyle = variant === 'primary'
        ? 'bg-blue-600 border-blue-600'
        : 'bg-white border-gray-300';
    const textStyle = variant === 'primary'
        ? 'text-white'
        : 'text-gray-700';

    return (
        <TouchableOpacity
            style={tw`${baseStyle} border px-6 py-3 rounded-lg flex-row items-center justify-center ${isLoading ? 'opacity-50' : ''
                }`}
            onPress={onRetry}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'primary' ? 'white' : '#3B82F6'}
                />
            ) : (
                <>
                    <Ionicons
                        name="refresh-outline"
                        size={16}
                        color={variant === 'primary' ? 'white' : '#6B7280'}
                        style={tw`mr-2`}
                    />
                    <Text style={tw`${textStyle} font-semibold`}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}