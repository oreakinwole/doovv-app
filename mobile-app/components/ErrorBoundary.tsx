import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={tw`flex-1 justify-center items-center px-6 bg-white`}>
                    <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
                    <Text style={tw`text-xl font-semibold text-gray-800 mt-4 text-center`}>
                        Something went wrong
                    </Text>
                    <Text style={tw`text-gray-600 mt-2 text-center`}>
                        An unexpected error occurred. Please try again.
                    </Text>
                    {__DEV__ && this.state.error && (
                        <View style={tw`mt-4 p-3 bg-red-50 rounded border border-red-200`}>
                            <Text style={tw`text-red-800 text-sm font-mono`}>
                                {this.state.error.message}
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity
                        style={tw`bg-blue-600 px-6 py-3 rounded-lg mt-6`}
                        onPress={this.handleRetry}
                    >
                        <Text style={tw`text-white font-semibold`}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}



// Updated package.json dependencies
/*
Add these to your package.json:

{
  "dependencies": {
    "@react-native-community/netinfo": "11.4.1",
    "@testing-library/react-native": "^12.7.2",
    "@testing-library/jest-native": "^5.4.3"
  },
  "devDependencies": {
    "jest-expo": "~52.0.1"
  }
}
*/