import { AntDesign, Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc'
import CustomButton from '~/components/Button'
import { transactions } from '~/db/transaction'
import FullPageModalLayout from '~/layout/FullPageModalLayout'
import LayoutPage from '~/layout/PageLayout'

const formatAmount = (amount: number) => {
    const prefix = amount >= 0 ? '+₦ ' : '-₦ ';
    return `${prefix}${Math.abs(amount).toLocaleString()}`;
};

const Wallet = () => {

    return (
        <LayoutPage classname={'p-4'}>
            <Text style={tw`text-[#100F0D] text-[20px] font-semibold my-5`}>My Wallet</Text>
            <Text style={tw`text-gray-500 mb-5`}>Get the best deals whenever you use Rout Tag</Text>

            <View style={tw`p-4 items-center bg-white rounded-xl`}>
                <View style={tw`flex-row items-center gap-3 w-full`}>
                    <View style={tw`bg-[#FFDCD7] p-3 rounded-full`}>
                        <FontAwesome name='money' size={20} color={'#FF6400'} />
                    </View>

                    <Text style={tw`text-[#FF6400] text-lg`}>Balance</Text>
                </View>

                <Text style={tw`my-7 text-3xl font-semibold`}>₦ 806,000</Text>

                <CustomButton label='Top Up' onPress={() => { }} variant='solid' />
            </View>
            <TouchableOpacity style={tw`p-4 flex-row items-center justify-between bg-white rounded-xl mt-4`} onPress={()=>router.push('/sender/transaction')}>
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