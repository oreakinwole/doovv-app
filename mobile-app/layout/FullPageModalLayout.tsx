import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode, useState } from 'react'
import { Modal, ScrollView, TouchableOpacity, View } from 'react-native'
import tw from 'twrnc';

interface FullPageModalLayoutProps {
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    children: ReactNode;
    classname?: any
    button?: any
    showBackButton?: boolean;
    onBackPress?: () => void;
}

const FullPageModalLayout: React.FC<FullPageModalLayoutProps> = ({ 
    modalVisible, 
    setModalVisible, 
    children, 
    classname, 
    button,
    showBackButton = false,
    onBackPress
}) => {
    const closeModal = () => setModalVisible(false);
    
    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            closeModal();
        }
    };

    return (
        <Modal
            visible={modalVisible}
            transparent={true}
            onRequestClose={closeModal}
        >
            <View style={tw`flex-1 bg-[#F3F3F4] mt-[12%]`}>
                {showBackButton && (
                    <View style={tw`p-4`}>
                        <TouchableOpacity
                            onPress={handleBackPress}
                            style={tw`w-8 h-8 rounded-full border border-gray-300 bg-white items-center justify-center`}
                        >
                            <Ionicons name="chevron-back" size={16} color="#FF6400" />
                        </TouchableOpacity>
                    </View>
                )}
                <ScrollView style={tw`flex-1 rounded-t-3xl`} overScrollMode='never'>
                    <View style={tw`flex-1 p-4 relative ${classname}`}>
                        {children}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}

export default FullPageModalLayout