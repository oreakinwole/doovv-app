import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import { useLocalSearchParams } from 'expo-router';
import LayoutPage from '~/layout/PageLayout';
import CustomButton from '~/components/Button';
import InputField from '~/components/Input';
import { router } from 'expo-router';
import { requests } from '~/api/requests';
import Toast from 'react-native-toast-message';

export default function ResetPasswordScreen() {
    const { email: paramEmail } = useLocalSearchParams();
    const [email, setEmail] = useState(paramEmail as string || '');
    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timer, setTimer] = useState(120);
    const [loading, setLoading] = useState(false);
    const inputRefs = React.useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (text: string, idx: number) => {
        if (text.length > 1) {
            const textArray = text.split('').slice(0, 6);
            setCode(textArray);
            inputRefs.current[5]?.focus();
            return;
        }

        const newCode = [...code];
        newCode[idx] = text;
        setCode(newCode);

        if (text && idx < code.length - 1) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, idx: number) => {
        if (e.nativeEvent.key === 'Backspace') {
            if (!code[idx] && idx > 0) {
                inputRefs.current[idx - 1]?.focus();
            }
        }
    };

    const handleResetPassword = async () => {
        if (!email.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Please enter your email',
                position: 'top'
            });
            return;
        }

        if (code.join('').length !== 6) {
            Toast.show({
                type: 'error',
                text1: 'Please enter the complete verification code',
                position: 'top'
            });
            return;
        }

        if (!password.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Please enter your new password',
                position: 'top'
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Passwords do not match',
                position: 'top'
            });
            return;
        }

        setLoading(true);

        try {
            const response = await requests.resetPassword(code.join(''), password, email);
            Toast.show({
                type: 'success',
                text1: response.data.message || 'Password reset successful',
                position: 'top'
            });

            setTimeout(() => router.push('/authentication/login' as any), 2000);

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error.response?.data?.message || 'An error occurred',
                position: 'top'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (timer === 0 && email.trim()) {
            try {
                const response = await requests.forgotPassword(email);
                Toast.show({
                    type: 'success',
                    text1: response.data.message || 'Reset code sent to your email',
                    position: 'top'
                });
                setTimer(120);
            } catch (error: any) {
                Toast.show({
                    type: 'error',
                    text1: error.response?.data?.message || "An error occurred",
                    position: 'top'
                });
            }
        }
    };

    return (
        <LayoutPage noscroll classname='flex-1 justify-center'>
            <View style={tw`px-3`}>


                <View style={tw`w-11/12 mx-auto my-5`}>
                    <Text style={tw`text-xl font-bold mb-2`}>Reset Password</Text>
                    <Text style={tw`text-gray-500 mb-5`}>
                        Enter the verification code sent to your email and create a new password
                    </Text>
                    <InputField
                        label="Email"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    <Text style={tw`mb-2 text-[#100F0D]`}>Verification Code</Text>
                    <View style={tw`flex-row justify-between items-center w-full mb-4`}>
                        {code.map((digit, idx) => (
                            <TextInput
                                key={idx}
                                ref={(ref) => (inputRefs.current[idx] = ref)}
                                value={digit}
                                onChangeText={(text) => handleChange(text, idx)}
                                onKeyPress={(e: any) => handleKeyPress(e, idx)}
                                maxLength={1}
                                keyboardType="number-pad"
                                returnKeyType="done"
                                editable={!loading}
                                style={tw`w-12 h-13 bg-white rounded-xl text-xl text-center border border-gray-200`}
                            />
                        ))}
                    </View>

                    <Text style={tw`mb-4`}>
                        Didn't receive the code?{" "}
                        {timer > 0 ? (
                            <Text style={tw`text-gray-500`}>{formatTime(timer)}</Text>
                        ) : loading ? (
                            <ActivityIndicator />
                        ) : (
                            <TouchableOpacity onPress={handleResendCode}>
                                <Text style={tw`text-orange-500 -mb-1`}>Resend</Text>
                            </TouchableOpacity>
                        )}
                    </Text>

                    <InputField
                        label="New Password"
                        placeholder="Enter new password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <InputField
                        label="Confirm New Password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <CustomButton
                        label='Reset Password'
                        onPress={handleResetPassword}
                        variant='solid'
                        loading={loading}
                        style={tw`mt-4`}
                    />
                </View>
            </View>
        </LayoutPage>
    );
}