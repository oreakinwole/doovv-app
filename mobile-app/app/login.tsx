import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import tw from 'twrnc';
import { useAuth } from '~/contexts/AuthContext';
import Toast from 'react-native-toast-message';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function LoginScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (values: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            await login(values.email, values.password);
            router.replace('/(app)');
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Login failed',
                text2: 'Please check your credentials and try again',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-white`}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={tw`flex-grow justify-center px-6`}>
                <View style={tw`mb-12`}>
                    <Text style={tw`text-4xl font-bold text-center text-gray-800 mb-2`}>
                        Welcome Back
                    </Text>
                    <Text style={tw`text-lg text-center text-gray-600`}>
                        Sign in to your account
                    </Text>
                </View>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                        <View style={tw`space-y-4`}>
                            <View>
                                <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Email</Text>
                                <TextInput
                                    style={tw`border border-gray-300 rounded-lg px-4 py-3 text-base ${touched.email && errors.email ? 'border-red-500' : ''
                                        }`}
                                    placeholder="Enter your email"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />
                                {touched.email && errors.email && (
                                    <Text style={tw`text-red-500 text-sm mt-1`}>{errors.email}</Text>
                                )}
                            </View>

                            <View>
                                <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Password</Text>
                                <TextInput
                                    style={tw`border border-gray-300 rounded-lg px-4 py-3 text-base ${touched.password && errors.password ? 'border-red-500' : ''
                                        }`}
                                    placeholder="Enter your password"
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    secureTextEntry
                                    autoComplete="password"
                                />
                                {touched.password && errors.password && (
                                    <Text style={tw`text-red-500 text-sm mt-1`}>{errors.password}</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                style={tw`bg-blue-600 rounded-lg py-4 mt-6 ${isLoading ? 'opacity-50' : ''}`}
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={tw`text-white text-center text-lg font-semibold`}>
                                        Sign In
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>

                <View style={tw`mt-8`}>
                    <Text style={tw`text-center text-gray-600 text-sm`}>
                        Demo Credentials:
                    </Text>
                    <Text style={tw`text-center text-gray-600 text-sm`}>
                        Customer: customer@test.com / password
                    </Text>
                    <Text style={tw`text-center text-gray-600 text-sm`}>
                        Washer: washer@test.com / password
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}