import { AntDesign, Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { FlatList, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import tw from 'twrnc'
import Toast from 'react-native-toast-message'
import CustomButton from '~/components/Button'
import { transactions } from '~/db/transaction'
import FullPageModalLayout from '~/layout/FullPageModalLayout'
import LayoutPage from '~/layout/PageLayout'
import { requests, WalletData } from '~/api/requests'

const formatAmount = (amount: number) => {
    const prefix = amount >= 0 ? '+₦ ' : '-₦ ';
    return `${prefix}${Math.abs(amount).toLocaleString()}`;
};

const Wallet = () => {
    const [courierWallet, setCourierWallet] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [creatingWallet, setCreatingWallet] = useState<boolean>(false);

    const fetchWallets = async () => {
        try {
            setLoading(true);
            const response = await requests.getWallets();
            
            if (response.data.status === 'success') {
                setCourierWallet(response.data.data.courierWallet);
            }
        } catch (error: any) {
            // console.error('Error fetching wallets:', error);
            Toast.show({
                type: 'error',
                text1: error.response?.data?.message || 'Failed to fetch wallet data',
                position: 'top'
            });
        } finally {
            setLoading(false);
        }
    };

    const createWallet = async () => {
        try {
            setCreatingWallet(true);
            const response = await requests.createWallet();
            
            Toast.show({
                type: 'success',
                text1: response.data?.message || 'Wallet created successfully',
                position: 'top'
            });

            // Refresh wallet data after creation
            await fetchWallets();
        } catch (error: any) {
            // console.error('Error creating wallet:', error);
            Toast.show({
                type: 'error',
                text1: error.response?.data?.message || 'Failed to create wallet',
                position: 'top'
            });
        } finally {
            setCreatingWallet(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    if (loading) {
        return (
            <LayoutPage noscroll classname={'p-4'}>
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#FF6400" />
                    <Text style={tw`mt-2 text-gray-500`}>Loading wallet...</Text>
                </View>
            </LayoutPage>
        );
    }

    if (!courierWallet) {
        return (
            <LayoutPage classname={'p-4'}>
                <Text style={tw`text-[#100F0D] text-[20px] font-semibold my-5`}>My Wallet</Text>
                <Text style={tw`text-gray-500 mb-5`}>Get the best deals whenever you use Route Tag</Text>

                <View style={tw`p-4 items-center bg-white rounded-xl`}>
                    <Text style={tw`text-gray-500 text-center mb-4`}>
                        You don't have a wallet yet. Create one to get started.
                    </Text>
                    
                    <CustomButton
                        label={creatingWallet ? 'Creating...' : 'Create Wallet'} 
                        onPress={createWallet}
                        variant='solid'
                        disabled={creatingWallet}
                    />
                </View>
            </LayoutPage>
        );
    }

    const balance = parseFloat(courierWallet.balance);

    return (
        <LayoutPage classname={'p-4'}>
            <Text style={tw`text-[#100F0D] text-[20px] font-semibold my-5`}>My Wallet</Text>
            <Text style={tw`text-gray-500 mb-5`}>Get the best deals whenever you use Route Tag</Text>

            <View style={tw`p-4 items-center bg-white rounded-xl`}>
                <View style={tw`flex-row items-center gap-3 w-full`}>
                    <View style={tw`bg-[#FFDCD7] p-3 rounded-full`}>
                        <FontAwesome name='money' size={20} color={'#FF6400'} />
                    </View>

                    <Text style={tw`text-[#FF6400] text-lg`}>Balance</Text>
                </View>

                <Text style={tw`my-7 text-3xl font-semibold`}>
                    ₦ {balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </Text>

                <CustomButton label='Top Up' onPress={() => { }} variant='solid' />
            </View>

            <TouchableOpacity 
                style={tw`p-4 flex-row items-center justify-between bg-white rounded-xl mt-4`} 
                onPress={() => router.push('/sender/transaction')}
            >
                <View style={tw`flex-row items-center gap-3`}>
                    <AntDesign name="clockcircleo" size={20} color="#273B4A" />
                    <Text style={tw`text-[#273B4A] text-[16px] font-normal`}>Transaction History</Text>
                </View>
                <Feather name="chevron-right" size={23} color="#273B4A" />
            </TouchableOpacity>
        </LayoutPage>
    );
};

export default Wallet;