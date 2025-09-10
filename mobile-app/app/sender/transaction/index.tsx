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

const TransactionItem = ({ item, handlePress }: { item: any; handlePress: (item: any) => void; }) => {
    const isPositive = item.amount >= 0;
    const isFailed = item.status === 'failed';

    return (
        <TouchableOpacity style={tw`px-4 py-4`} onPress={() => handlePress(item)}>
            <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`flex-row items-center`}>
                    <View style={tw`bg-[#E5E3E3] rounded-full p-2 mr-4`}>
                        <AntDesign
                            name={isPositive ? "arrowup" : "arrowdown"}
                            size={24}
                            color={"#9E9392"}
                        />
                    </View>
                    <View>
                        <Text style={tw`text-base font-medium`}>{item.title}</Text>
                        <Text style={tw`text-gray-400`}>{item.time}</Text>
                    </View>
                </View>
                <View>
                    <Text style={[
                        tw`text-right font-medium text-base`,
                        isPositive ? tw`text-green-600` : tw`text-black`
                    ]}>
                        {formatAmount(item.amount)}
                    </Text>
                    {isFailed && <Text style={tw`text-red-500 text-right`}>Failed</Text>}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const Separator = () => (
    <View style={tw`border-b border-gray-200 mx-4`}></View>
);

const Transaction = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [transactionDetail, setTransactionDetail] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<{ id: string; title: string; amount: number; status: string; time: string; type: string; } | null>(null);

    const handleTransactionPress = (transaction: any) => {
        setSelectedTransaction(transaction);
        setTransactionDetail(true);
        setModalVisible(false);
    };
    
    return (
        <LayoutPage noscroll customBackFunction={()=>router.push("/sender/tabs/Wallet")}>
            <View style={tw`p-4 flex-1`}>
                <Text style={tw`my-2 text-xl font-semibold`}>Transaction History</Text>
                <FlatList
                    data={transactions}
                    renderItem={({ item }) => (
                        <TransactionItem
                            item={item}
                            handlePress={handleTransactionPress}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={Separator}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {transactionDetail && selectedTransaction && (
                <FullPageModalLayout
                    modalVisible={transactionDetail}
                    setModalVisible={setTransactionDetail}
                    button={() => { setTransactionDetail(false); }}
                    classname={'p-3'}
                >
                    <Text style={tw`my-5 text-xl font-semibold`}>Transaction Detail</Text>

                    <View style={tw`bg-white rounded-3xl p-6 shadow`}>
                        <View style={tw`items-center mb-8`}>
                            <Text style={tw`text-lg`}>{selectedTransaction.title}</Text>
                            <Text style={tw`text-3xl font-bold my-1`}>
                                {selectedTransaction.amount >= 0 ? '₦ ' : '-₦ '}
                                {Math.abs(selectedTransaction.amount).toLocaleString()}
                            </Text>
                            <Text style={tw`${selectedTransaction.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                {selectedTransaction.status === 'success' ? 'Successful' : 'Failed'}
                            </Text>
                        </View>

                        <View style={tw`mb-6`}>
                            {selectedTransaction.amount >= 0 ? (
                                <>
                                    <View style={tw`flex-row justify-between py-3`}>
                                        <Text style={tw`text-gray-500`}>Top up Amount</Text>
                                        <Text style={tw`font-medium`}>
                                            ₦ {Math.abs(selectedTransaction.amount).toLocaleString()}
                                        </Text>
                                    </View>

                                    <View style={tw`flex-row justify-between py-3`}>
                                        <Text style={tw`text-gray-500`}>Fee</Text>
                                        <Text style={tw`font-medium`}>₦ 10</Text>
                                    </View>

                                    <View style={tw`flex-row justify-between py-3`}>
                                        <Text style={tw`text-gray-500`}>Net Amount</Text>
                                        <Text style={tw`font-medium`}>
                                            ₦ {Math.abs(selectedTransaction.amount).toLocaleString()}
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <View style={tw`flex-row justify-between py-3`}>
                                    <Text style={tw`text-gray-500`}>Charge Amount</Text>
                                    <Text style={tw`font-medium`}>
                                        ₦ {Math.abs(selectedTransaction.amount).toLocaleString()}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={tw`border-t border-gray-200 border-dashed my-2`}></View>

                        <View style={tw`mt-2`}>
                            <View style={tw`flex-row justify-between py-3`}>
                                <Text style={tw`text-gray-500`}>Session ID</Text>
                                <View style={tw`flex-row items-center`}>
                                    <Text style={tw`font-medium w-28 mr-2`}>
                                        {`${selectedTransaction.id}83997657907645`}
                                    </Text>
                                    <TouchableOpacity>
                                        <Feather name="copy" size={18} color="#888" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={tw`flex-row justify-between py-3`}>
                                <Text style={tw`text-gray-500`}>Session Time</Text>
                                <Text style={tw`font-medium`}>{selectedTransaction.time}</Text>
                            </View>

                            <View style={tw`flex-row justify-between py-3`}>
                                <Text style={tw`text-gray-500`}>Transaction ID</Text>
                                <View style={tw`flex-row items-center`}>
                                    <Text style={tw`font-medium mr-2`}>tx{selectedTransaction.id}122</Text>
                                    <TouchableOpacity>
                                        <Feather name="copy" size={18} color="#888" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={tw`flex-row justify-between py-3`}>
                                <Text style={tw`text-gray-500`}>Payment Type</Text>
                                <Text style={tw`font-medium`}>
                                    {selectedTransaction.type === 'topup' ? 'Wallet Top up' : 'Charge Payment'}
                                </Text>
                            </View>

                            <View style={tw`flex-row justify-between py-3`}>
                                <Text style={tw`text-gray-500`}>Payment Method</Text>
                                <Text style={tw`font-medium`}>
                                    {selectedTransaction.type === 'topup' ? 'Debit Card - Paystack' : 'Wallet Balance'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={tw`flex-row justify-between mt-6 px-4`}>
                        <TouchableOpacity style={tw`items-center`}>
                            <View style={tw`bg-red-100 p-3 rounded-full mb-2`}>
                                <AntDesign name="questioncircleo" size={18} color="#888" />
                            </View>
                            <Text style={tw`text-xs`}>Dispute</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={tw`items-center`}>
                            <View style={tw`bg-red-100 p-3 rounded-full mb-2`}>
                                <Feather name="share" size={18} color="#888" />
                            </View>
                            <Text style={tw`text-xs`}>Share as Image</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={tw`items-center`}>
                            <View style={tw`bg-red-100 p-3 rounded-full mb-2`}>
                                <FontAwesome5 name="file-pdf" size={18} color="#888" />
                            </View>
                            <Text style={tw`text-xs`}>Share as PDF</Text>
                        </TouchableOpacity>
                    </View>
                </FullPageModalLayout>
            )}
        </LayoutPage>
    )
}

export default Transaction