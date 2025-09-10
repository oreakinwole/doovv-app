import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    SafeAreaView,
    TouchableWithoutFeedback
} from 'react-native';
import tw from 'twrnc';

interface SelectInputProps {
    label?: string;
    placeholder?: string;
    options?: { value: string | number; label: string }[];
    value?: string | number | null;
    onChange: (value: string | number) => void;
    error?: string | null;
}

export const SelectField: React.FC<SelectInputProps> = ({
    label,
    placeholder = 'Select an option',
    options = [],
    value = null,
    onChange,
    error = null
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    // Find the selected option label to display
    const selectedOption = options.find(option => option.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const handleSelect = (option: any) => {
        onChange(option.value);
        closeModal();
    };

    return (
        <View style={tw`mb-5`}>
            {/* Label */}
            {label && (
                <Text style={tw`text-[#100F0D] text-[16px] font-medium mb-2`}>{label}</Text>
            )}

            {/* Select Field Button */}
            <TouchableOpacity
                onPress={openModal}
                style={tw` flex-row justify-between items-center rounded-lg p-4 ${error ? 'border-red-500' : 'border-gray-300'} bg-white`}
            >
                <Text style={tw`${value ? 'text-gray-800' : 'text-[#9E9392]'} flex-1 ml-3 text-[17px]`}>
                    {displayText}
                </Text>
                <Feather name='chevron-down' size={20}/>
            </TouchableOpacity>

            {/* Error Message */}
            {/* {error && (
                <Text style={tw`text-red-500 text-sm mt-1`}>{error}</Text>
            )} */}

            {/* Modal for options */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={tw`flex-1 bg-black bg-opacity-40 justify-end`}>
                        <TouchableWithoutFeedback>
                            <View style={tw`bg-white rounded-t-xl`}>
                                <SafeAreaView>
                                    <View style={tw`px-4 py-3 border-b border-gray-200 flex-row justify-between items-center`}>
                                        <Text style={tw`text-lg font-medium text-gray-800`}>{label || 'Select Option'}</Text>
                                        <TouchableOpacity onPress={closeModal}>
                                            <Text style={tw`text-[#FF6400] font-medium`}>Done</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <FlatList
                                        data={options}
                                        keyExtractor={(item) => item.value.toString()}
                                        style={tw`max-h-96`}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={tw`px-4 py-3 border-b border-gray-100 flex-row items-center`}
                                                onPress={() => handleSelect(item)}
                                            >
                                                <Text style={tw`text-gray-800 flex-1`}>{item.label}</Text>
                                                {item.value === value && (
                                                    <View style={tw`w-6 h-6 rounded-full bg-[#FF6400] items-center justify-center`}>
                                                        <Text style={tw`text-white font-bold`}>✓</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    />
                                </SafeAreaView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};