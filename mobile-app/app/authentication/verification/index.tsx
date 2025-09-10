import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import tw from 'twrnc';
import LayoutPage from '~/layout/PageLayout';
import CustomButton from '~/components/Button';
import { router } from 'expo-router';
import { passRoute, UserAuthentication } from '~/utils/authentication.flow';
import { requests } from '~/api/requests';
import Toast from 'react-native-toast-message';
import { useAuth } from '~/context/AuthContext';

export default function VerificationScreen() {
    const [email] = useState(UserAuthentication.email);
    const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(120);
    const [loading, setLoading] = useState(false);
    const inputRefs = React.useRef<(TextInput | null)[]>([]);
    
    const { checkTokenValidity } = useAuth();

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

    const handleVerifyOTP = async () => {
        setLoading(true);

        try {
            const response = await requests.verifyEmail(email, code.join(''));
            Toast.show({
                type: 'success',
                text1: response.data.message,
                position: 'top'
            });

            await checkTokenValidity();
            
            setTimeout(() => {
                if (passRoute.url) {
                    router.replace(passRoute.url as any);
                } else {
                    router.replace('/authentication/login');
                }
            }, 2000);

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error.response?.data?.message || 'An error occurred',
                position: 'top'
            });
        } finally {
            setCode(['', '', '', '', '', '']);
            setLoading(false);
            passRoute.url = '';
            UserAuthentication.email = '';
        }
    };

    const handleResend = async () => {
        if (timer === 0) {
            try {
                const response = await requests.resendCode(email);
                Toast.show({
                    type: 'success',
                    text1: response.data.message,
                    position: 'top'
                });
            } catch (error: any) {
                Toast.show({
                    type: 'error',
                    text1: error.response?.data?.message || "An error occurred",
                    position: 'top'
                });
            }

            setTimer(120);
        }
    };

    return (
        <LayoutPage noscroll classname='flex-1 justify-center'>
            <View style={tw`p-3`}>
                <Text style={tw`text-xl font-bold mb-2`}>OTP Verification</Text>
                <Text style={tw`text-gray-500 mb-5`}>
                    OTP has been sent to <Text style={tw`font-bold`}>{email}</Text>
                </Text>

                <View style={tw`w-11/12 mx-auto my-5`}>
                    <Text style={tw`mb-4 text-[#100F0D]`}>Enter Code</Text>
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
                                style={tw`w-12 h-13 bg-[#FFDCD7] rounded-xl text-xl text-center`}
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
                            <TouchableOpacity onPress={handleResend}>
                                <Text style={tw`text-orange-500 -mb-1`}>Resend</Text>
                            </TouchableOpacity>
                        )}
                    </Text>
                </View>

                <CustomButton label='Verify' onPress={() => handleVerifyOTP()} variant='solid' loading={loading} />

            </View>
        </LayoutPage>
    );
}